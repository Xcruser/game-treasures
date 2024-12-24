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

  // Lösche alle existierenden Einträge
  await prisma.item.deleteMany();

  const dicePackages = [
    {
      name: '6.000 Würfel Paket',
      description: 'Paket mit 6.000 hochwertigen Würfeln.',
      price: 19.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-6k.png',
      inStock: -1
    },
    {
      name: '10.000 Würfel Paket',
      description: 'Paket mit 10.000 hochwertigen Würfeln.',
      price: 24.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-10k.png',
      inStock: -1
    },
    {
      name: '15.000 Würfel Paket',
      description: 'Paket mit 15.000 hochwertigen Würfeln.',
      price: 29.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-15k.png',
      inStock: -1
    },
    {
      name: '20.000 Würfel Paket',
      description: 'Paket mit 20.000 hochwertigen Würfeln.',
      price: 39.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-20k.png',
      inStock: -1
    },
    {
      name: '30.000 Würfel Paket',
      description: 'Paket mit 30.000 hochwertigen Würfeln.',
      price: 59.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-30k.png',
      inStock: -1
    },
    {
      name: '40.000 Würfel Paket',
      description: 'Paket mit 40.000 hochwertigen Würfeln.',
      price: 69.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-40k.png',
      inStock: -1
    },
    {
      name: '50.000 Würfel Paket',
      description: 'Paket mit 50.000 hochwertigen Würfeln.',
      price: 85.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-50k.png',
      inStock: -1
    },
    {
      name: '60.000 Würfel Paket',
      description: 'Paket mit 60.000 hochwertigen Würfeln.',
      price: 94.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-60k.png',
      inStock: -1
    },
    {
      name: '70.000 Würfel Paket',
      description: 'Paket mit 70.000 hochwertigen Würfeln.',
      price: 104.99,
      game: 'Würfel',
      category: 'Würfelpakete',
      imageUrl: '/products/dice-70k.png',
      inStock: -1
    }
  ];

  for (const item of dicePackages) {
    await prisma.item.create({
      data: item
    });
  }

  console.log('Seed erfolgreich ausgeführt');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
