import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt for email:', email);

    if (!email || !password) {
      console.log('Missing credentials');
      return NextResponse.json(
        { success: false, message: 'Email und Passwort sind erforderlich' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { success: false, message: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { success: false, message: 'Ungültige Anmeldedaten' },
        { status: 401 }
      );
    }

    // Generate JWT token
    console.log('Generating token for user:', user.id);
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    const token = generateToken(tokenPayload);
    console.log('Token generated successfully');

    // Create response with token
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    // Set HTTP-only cookie
    console.log('Setting auth cookie');
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    );
  }
}
