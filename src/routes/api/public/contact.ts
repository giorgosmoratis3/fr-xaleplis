import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { sendTemplateEmail } from '@/lib/email-templates/send-email'

const OWNER_EMAILS = ['xaleplis@yahoo.gr', 'kirntasios21@gmail.com']

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  level: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().max(3000).optional().default(''),
})

// Simple in-memory rate limit per IP (best-effort).
const hits = new Map<string, number[]>()
function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > 5
}

export const Route = createFileRoute('/api/public/contact')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get('cf-connecting-ip') ||
          request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
          'unknown'
        if (rateLimited(ip)) {
          return Response.json({ ok: false, error: 'rate_limited' }, { status: 429 })
        }

        let payload: unknown
        try {
          payload = await request.json()
        } catch {
          return Response.json({ ok: false, error: 'invalid_json' }, { status: 400 })
        }

        const parsed = schema.safeParse(payload)
        if (!parsed.success) {
          return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 })
        }
        const data = parsed.data
        const submissionId = crypto.randomUUID()

        // 1) Persist the submission first so nothing is ever lost.
        let stored = false
        try {
          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const { error } = await supabaseAdmin.from('contact_messages').insert({
            id: submissionId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            level: data.level || null,
            message: data.message || null,
          })
          if (error) console.error('contact store failed', error)
          else stored = true
        } catch (error) {
          console.error('contact store failed', error)
        }

        // 2) Try to email; a delivery problem must not break the form.
        let emailed = false
        try {
          for (const owner of OWNER_EMAILS) {
            await sendTemplateEmail('contact-notification', owner, {
              templateData: data,
              idempotencyKey: `contact-notification-${owner}-${submissionId}`,
              replyTo: data.email,
            })
          }
          await sendTemplateEmail('contact-confirmation', data.email, {
            templateData: { name: data.name },
            idempotencyKey: `contact-confirmation-${submissionId}`,
          })
          emailed = true
        } catch (error) {
          console.error('contact form send failed', error)
        }

        if (emailed && stored) {
          try {
            const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
            await supabaseAdmin
              .from('contact_messages')
              .update({ emailed: true })
              .eq('id', submissionId)
          } catch (error) {
            console.error('contact flag update failed', error)
          }
        }

        if (!stored && !emailed) {
          return Response.json({ ok: false, error: 'send_failed' }, { status: 500 })
        }

        return Response.json({ ok: true, emailed })
      },
    },
  },
})
