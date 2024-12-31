import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Verbindung zur Datenbank wird hergestellt...');
    
    const itemCount = await prisma.item.count();
    console.log(`Anzahl der Produkte in der Datenbank: ${itemCount}`);
    
    const items = await prisma.item.findMany();
    console.log('Gefundene Produkte:');
    console.log(JSON.stringify(items, null, 2));
  } catch (error) {
    console.error('Fehler beim Datenbankzugriff:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
