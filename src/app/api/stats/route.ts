import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Hole die Anzahl der Newsletter-Abonnenten
    const subscriberCount = await prisma.newsletterSubscriber.count({
      where: {
        isActive: true,
      },
    });

    // Hole andere Statistiken...
    const productCount = await prisma.product.count();
    // ... weitere Statistiken

    return NextResponse.json({
      stats: {
        subscriberCount,
        productCount,
        // ... weitere Statistiken
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    );
  }
}
