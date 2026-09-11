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
        } catch (error) {
          console.error('contact form send failed', error)
          return Response.json({ ok: false, error: 'send_failed' }, { status: 500 })
        }

        return Response.json({ ok: true })
      },
    },
  },
})
