import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const templates = await prisma.emailTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Fehler beim Laden der Templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, subject, content } = await request.json();

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.create({
      data: { name, subject, content },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Templates' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, name, subject, content } = await request.json();

    if (!id || !name || !subject || !content) {
      return NextResponse.json(
        { error: 'Alle Felder sind erforderlich' },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.update({
      where: { id },
      data: { name, subject, content },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating email template:', error);
    return NextResponse.json(
      { error: 'Fehler beim Aktualisieren des Templates' },
      { status: 500 }
    );
  }
}
