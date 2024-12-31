import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Hole alle einzigartigen Spiele aus der Datenbank
    const games = await prisma.item.findMany({
      select: {
        game: true
      },
      distinct: ['game']
    });

    // Extrahiere die Spielnamen und filtere leere Werte
    const gameNames = games
      .map(item => item.game)
      .filter(game => game)
      .sort();

    return NextResponse.json(gameNames);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Error fetching games' }, { status: 500 });
  }
}
