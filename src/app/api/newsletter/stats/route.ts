import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const subscriberCount = await prisma.newsletterSubscriber.count({
      where: {
        isActive: true,
      },
    });

    const templateCount = await prisma.emailTemplate.count();
    
    const pendingEmailsCount = await prisma.scheduledEmail.count({
      where: {
        status: 'pending',
      },
    });

    return NextResponse.json({
      stats: {
        subscriberCount,
        templateCount,
        pendingEmailsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter stats:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Statistiken' },
      { status: 500 }
    );
  }
}
