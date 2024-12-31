import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400 }
      );
    }

    // Prüfe, ob die E-Mail bereits existiert
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { error: 'Diese E-Mail-Adresse ist bereits angemeldet' },
          { status: 400 }
        );
      } else {
        // Reaktiviere den Abonnenten
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null,
            subscribedAt: new Date(), // Aktualisiere das Anmeldedatum
          },
        });
        return NextResponse.json({ message: 'Newsletter-Anmeldung reaktiviert' });
      }
    }

    // Erstelle einen neuen Abonnenten
    await prisma.newsletterSubscriber.create({
      data: {
        email,
        isActive: true,
        subscribedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Erfolgreich zum Newsletter angemeldet' });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Newsletter-Anmeldung' },
      { status: 500 }
    );
  }
}
