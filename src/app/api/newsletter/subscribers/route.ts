import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        subscribedAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        subscribedAt: true,
      },
    });

    return NextResponse.json({
      subscribers: subscribers.map(subscriber => ({
        ...subscriber,
        createdAt: subscriber.subscribedAt, // Für Kompatibilität mit der Frontend-Schnittstelle
      })),
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Abonnenten' },
      { status: 500 }
    );
  }
}
