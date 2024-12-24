import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Konfiguriere den E-Mail-Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function processScheduledEmails() {
  try {
    // Hole alle fälligen E-Mails
    const dueEmails = await prisma.scheduledEmail.findMany({
      where: {
        status: 'pending',
        scheduledFor: {
          lte: new Date(),
        },
      },
      include: {
        template: true,
      },
    });

    // Hole alle aktiven Newsletter-Abonnenten
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        isActive: true,
      },
    });

    for (const email of dueEmails) {
      try {
        // Sende die E-Mail an alle Abonnenten
        for (const subscriber of subscribers) {
          await sendEmail(
            subscriber.email,
            email.template.subject,
            email.template.content
          );

          // Aktualisiere den Zeitpunkt der letzten E-Mail
          await prisma.newsletterSubscriber.update({
            where: { id: subscriber.id },
            data: { lastEmailSentAt: new Date() },
          });
        }

        // Markiere die geplante E-Mail als gesendet
        await prisma.scheduledEmail.update({
          where: { id: email.id },
          data: {
            status: 'sent',
            sentAt: new Date(),
          },
        });
      } catch (error) {
        console.error(`Error processing scheduled email ${email.id}:`, error);
        
        // Markiere die E-Mail als fehlgeschlagen
        await prisma.scheduledEmail.update({
          where: { id: email.id },
          data: {
            status: 'failed',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error processing scheduled emails:', error);
  }
}
