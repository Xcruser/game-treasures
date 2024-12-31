import { PrismaClient } from '@prisma/client';

declare global {
  let prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client;
}

export const prisma = client;
export default client;

// Verbindung testen
client.$connect()
  .then(() => {
    console.log('Successfully connected to database');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });
