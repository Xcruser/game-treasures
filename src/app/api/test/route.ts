import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.item.count();
    return NextResponse.json({ count, message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed', details: error }, { status: 500 });
  }
}
