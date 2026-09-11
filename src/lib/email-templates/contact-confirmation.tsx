import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

export interface ContactConfirmationProps {
  name?: string
}

function ContactConfirmation({ name = '' }: ContactConfirmationProps) {
  return (
    <Html lang="el">
      <Head />
      <Preview>Λάβαμε το μήνυμά σου — Φροντιστήριο Χαλεπλής</Preview>
      <Body style={{ backgroundColor: '#f4f4f6', fontFamily: 'Helvetica, Arial, sans-serif', margin: 0, padding: '24px' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '28px', maxWidth: '560px' }}>
          <Heading style={{ fontSize: '20px', color: '#12172a', margin: '0 0 4px' }}>
            Ευχαριστούμε{name ? `, ${name}` : ''}!
          </Heading>
          <Text style={{ color: '#c0392b', fontSize: '13px', letterSpacing: '1px', margin: '0 0 18px' }}>
            ΦΡΟΝΤΙΣΤΗΡΙΟ ΧΑΛΕΠΛΗΣ
          </Text>
          <Hr style={{ borderColor: '#e4e4ea' }} />
          <Text style={{ color: '#12172a', lineHeight: '1.6' }}>
            Λάβαμε το αίτημά σου και θα επικοινωνήσουμε μαζί σου το συντομότερο δυνατό.
          </Text>
          <Text style={{ color: '#12172a', lineHeight: '1.6' }}>
            Για άμεση επικοινωνία: 22310 44022 ή 6948 237 053.<br />
            Πλατεία Ελευθερίας 11, Λαμία.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: ContactConfirmation,
  subject: 'Λάβαμε το μήνυμά σου — Φροντιστήριο Χαλεπλής',
  displayName: 'Επιβεβαίωση φόρμας επικοινωνίας',
  previewData: { name: 'Μαρία' },
} satisfies TemplateEntry
