import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface ContactNotificationProps {
  name?: string
  email?: string
  phone?: string
  level?: string
  message?: string
}

function ContactNotification({
  name = '—',
  email = '—',
  phone = '—',
  level = '—',
  message = '',
}: ContactNotificationProps) {
  return (
    <Html lang="el">
      <Head />
      <Preview>{`Νέο αίτημα επικοινωνίας: ${name}`}</Preview>
      <Body style={{ backgroundColor: '#f4f4f6', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '24px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '28px', maxWidth: '560px' }}>
          <Heading style={{ fontSize: '20px', color: '#12172a', margin: '0 0 4px' }}>
            Νέο αίτημα από τη φόρμα επικοινωνίας
          </Heading>
          <Text style={{ color: '#c0392b', fontSize: '13px', letterSpacing: '1px', margin: '0 0 18px' }}>
            ΦΡΟΝΤΙΣΤΗΡΙΟ ΧΑΛΕΠΛΗΣ
          </Text>
          <Hr style={{ borderColor: '#e4e4ea' }} />
          <Section>
            <Text style={{ margin: '10px 0', color: '#12172a' }}><strong>Ονοματεπώνυμο:</strong> {name}</Text>
            <Text style={{ margin: '10px 0', color: '#12172a' }}><strong>Email:</strong> {email}</Text>
            <Text style={{ margin: '10px 0', color: '#12172a' }}><strong>Τηλέφωνο:</strong> {phone}</Text>
            <Text style={{ margin: '10px 0', color: '#12172a' }}><strong>Τάξη:</strong> {level}</Text>
            <Text style={{ margin: '10px 0', color: '#12172a', whiteSpace: 'pre-wrap' }}>
              <strong>Σχόλια:</strong> {message || '—'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactNotification,
  subject: (data: Record<string, any>) =>
    `Νέο αίτημα επικοινωνίας — ${data['name'] || 'Ιστοσελίδα'}`,
  displayName: 'Ειδοποίηση φόρμας επικοινωνίας',
  previewData: {
    name: 'Μαρία Παπαδοπούλου',
    email: 'maria@example.com',
    phone: '6900000000',
    level: 'Γ’ Λυκείου',
    message: 'Θα ήθελα πληροφορίες για το πρόγραμμα σπουδών.',
  },
} satisfies TemplateEntry
