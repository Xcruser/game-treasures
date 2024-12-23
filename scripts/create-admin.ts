import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createInitialAdmin() {
  try {
    const email = 'admin@gametreasures.de';
    const password = 'Admin@GT2023'; // Ändern Sie dies in ein sicheres Passwort

    // Prüfe, ob Admin bereits existiert
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin-Benutzer existiert bereits');
      return;
    }

    // Hash das Passwort
    const hashedPassword = await bcrypt.hash(password, 12);

    // Erstelle Admin
    const admin = await prisma.admin.create({
      data: {
        email,
        hashedPassword,
        name: 'System Admin',
      },
    });

    console.log('Admin-Benutzer erfolgreich erstellt:', admin.email);
  } catch (error) {
    console.error('Fehler beim Erstellen des Admin-Benutzers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialAdmin();
