import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'E-Mail-Adresse erforderlich' },
        { status: 400 }
      );
    }

    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber || !subscriber.isActive) {
      return NextResponse.json(
        { error: 'Abonnement nicht gefunden' },
        { status: 404 }
      );
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Erfolgreich abgemeldet' });
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Abmeldung' },
      { status: 500 }
    );
  }
}
