import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Hole alle Items und gruppiere sie nach Spiel und Kategorie
    const items = await prisma.item.findMany({
      select: {
        game: true,
        category: true
      }
    });

    // Gruppiere die Kategorien nach Spiel
    const categories = items.reduce((acc: { [key: string]: string[] }, item) => {
      if (!item.game) return acc;
      
      if (!acc[item.game]) {
        acc[item.game] = [];
      }
      
      if (item.category && !acc[item.game].includes(item.category)) {
        acc[item.game].push(item.category);
      }
      
      return acc;
    }, {});

    // Sortiere die Kategorien für jedes Spiel
    Object.keys(categories).forEach(game => {
      categories[game].sort();
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { game, category } = await request.json();

    if (!game || !category) {
      return NextResponse.json(
        { error: 'Game and category are required' },
        { status: 400 }
      );
    }

    // Wir speichern keine separaten Kategorien in der Datenbank,
    // da sie implizit durch die Produkte definiert werden.
    // Stattdessen senden wir einfach eine erfolgreiche Antwort zurück.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving category:', error);
    return NextResponse.json(
      { error: 'Error saving category' },
      { status: 500 }
    );
  }
}
