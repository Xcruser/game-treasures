import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

// GET: Alle Benutzer abrufen
export async function GET() {
  console.log('GET /api/admin/users - Start');
  try {
    // Teste zuerst die Datenbankverbindung
    await prisma.$connect();
    console.log('Database connection successful');

    // Hole die Benutzer
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Users fetched:', users);

    // Stelle sicher, dass wir ein Array zurückgeben, auch wenn es leer ist
    return NextResponse.json(users || []);
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log('GET /api/admin/users - End');
  }
}

// POST: Neuen Benutzer erstellen
export async function POST(request: Request) {
  console.log('POST /api/admin/users - Start');
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { username, email, password, role } = body;

    // Validiere Input
    if (!username || !email || !password || !role) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await prisma.$connect();
    console.log('Database connection successful');

    // Prüfe ob Benutzer bereits existiert
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Erstelle Benutzer
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    console.log('User created:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in POST /api/admin/users:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log('POST /api/admin/users - End');
  }
}

interface UpdateData {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

// PATCH: Benutzer aktualisieren
export async function PATCH(request: Request) {
  console.log('PATCH /api/admin/users - Start');
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const { id, username, email, password, role } = body;

    if (!id) {
      console.log('Missing user ID');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await prisma.$connect();
    console.log('Database connection successful');

    const updateData: UpdateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await hash(password, 10);
    if (role) updateData.role = role;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    console.log('User updated:', user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in PATCH /api/admin/users:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log('PATCH /api/admin/users - End');
  }
}

// DELETE: Benutzer löschen
export async function DELETE(request: Request) {
  console.log('DELETE /api/admin/users - Start');
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('Deleting user with ID:', id);

    if (!id) {
      console.log('Missing user ID');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await prisma.$connect();
    console.log('Database connection successful');

    await prisma.user.delete({
      where: { id }
    });

    console.log('User deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/admin/users:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  } finally {
    await prisma.$disconnect();
    console.log('DELETE /api/admin/users - End');
  }
}
