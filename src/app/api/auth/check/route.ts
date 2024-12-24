import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Nicht authentifiziert' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, message: 'Fehler bei der Authentifizierung' },
      { status: 500 }
    );
  }
}
