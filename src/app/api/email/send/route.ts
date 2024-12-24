import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { templateId } = await request.json();

    // Hole das Template
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template nicht gefunden' },
        { status: 404 }
      );
    }

    // Hole alle aktiven Abonnenten
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        isActive: true,
      },
    });

    // Sende die E-Mail an alle Abonnenten
    const results = await Promise.all(
      subscribers.map(async (subscriber) => {
        try {
          await sendEmail(
            subscriber.email,
            template.subject,
            template.content
          );

          // Aktualisiere den Zeitpunkt der letzten E-Mail
          await prisma.newsletterSubscriber.update({
            where: { id: subscriber.id },
            data: { lastEmailSentAt: new Date() },
          });

          return { success: true, email: subscriber.email };
        } catch (error) {
          console.error(`Error sending email to ${subscriber.email}:`, error);
          return { success: false, email: subscriber.email, error };
        }
      })
    );

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    return NextResponse.json({
      message: `E-Mail an ${successful} Abonnenten gesendet, ${failed} fehlgeschlagen`,
      results,
    });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden der E-Mails' },
      { status: 500 }
    );
  }
}
