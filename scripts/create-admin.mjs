import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function createInitialAdmin() {
  try {
    const email = 'admin@gametreasures.de';
    const password = 'Admin@GT2023'; // Ändern Sie dies in ein sicheres Passwort

    console.log('Verbinde mit Datenbank...');
    
    // Prüfe, ob Admin bereits existiert
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin-Benutzer existiert bereits');
      return;
    }

    console.log('Erstelle neuen Admin-Benutzer...');

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
