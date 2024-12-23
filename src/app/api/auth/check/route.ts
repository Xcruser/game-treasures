import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({ isLoggedIn: !!session });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ isLoggedIn: false });
  }
}
