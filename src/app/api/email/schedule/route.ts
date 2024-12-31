import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const scheduledEmails = await prisma.scheduledEmail.findMany({
      orderBy: { scheduledFor: 'asc' },
      where: {
        status: 'pending',
        scheduledFor: {
          gte: new Date(),
        },
      },
      include: {
        template: true,
      },
    });

    return NextResponse.json({ scheduledEmails });
  } catch (error) {
    console.error('Error fetching scheduled emails:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der geplanten E-Mails' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { templateId, scheduledFor } = await request.json();

    if (!templateId || !scheduledFor) {
      return NextResponse.json(
        { error: 'Template ID und Zeitpunkt sind erforderlich' },
        { status: 400 }
      );
    }

    const scheduledEmail = await prisma.scheduledEmail.create({
      data: {
        templateId,
        scheduledFor: new Date(scheduledFor),
      },
    });

    return NextResponse.json({ scheduledEmail });
  } catch (error) {
    console.error('Error scheduling email:', error);
    return NextResponse.json(
      { error: 'Fehler beim Planen der E-Mail' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'E-Mail ID ist erforderlich' },
        { status: 400 }
      );
    }

    await prisma.scheduledEmail.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'E-Mail erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error deleting scheduled email:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen der E-Mail' },
      { status: 500 }
    );
  }
}
