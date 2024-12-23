import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function authenticateAdmin(email: string, password: string) {
  try {
    // Finde Admin anhand der E-Mail
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return null;
    }

    // Überprüfe das Passwort
    const isValid = await bcrypt.compare(password, admin.hashedPassword);

    if (!isValid) {
      return null;
    }

    // Aktualisiere lastLogin
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLogin: new Date() },
    });

    // Gib Admin-Daten ohne Passwort zurück
    const { hashedPassword, ...adminData } = admin;
    return adminData;
  } catch (error) {
    console.error('Authentifizierungsfehler:', error);
    return null;
  }
}

export async function createAdmin(email: string, password: string, name?: string) {
  try {
    // Prüfe, ob Admin bereits existiert
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new Error('Admin mit dieser E-Mail existiert bereits');
    }

    // Hash das Passwort
    const hashedPassword = await bcrypt.hash(password, 12);

    // Erstelle neuen Admin
    const admin = await prisma.admin.create({
      data: {
        email,
        hashedPassword,
        name,
      },
    });

    // Gib Admin-Daten ohne Passwort zurück
    const { hashedPassword: _, ...adminData } = admin;
    return adminData;
  } catch (error) {
    console.error('Fehler beim Erstellen des Admins:', error);
    throw error;
  }
}
