import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Erstelle Admin-Benutzer
  const adminEmail = 'admin@gametreasures.de';
  const adminPassword = 'admin123'; // Ändern Sie dies in ein sicheres Passwort

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
        role: 'admin',
      },
    });

    console.log('Admin-Benutzer erstellt');
  } else {
    console.log('Admin-Benutzer existiert bereits');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
