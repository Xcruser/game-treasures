import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    const isAdmin = session.user.role === 'ADMIN';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    // Erfolgreiche Anmeldung
    return NextResponse.json({
      message: 'Erfolgreich angemeldet',
      admin: session.user,
    });
  } catch (error) {
    console.error('Login-Fehler:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler' },
      { status: 500 }
    );
  }
}
