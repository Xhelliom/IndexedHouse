import { PrismaClient } from '@prisma/client';

// Client Prisma singleton pour éviter les multiples connexions en dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.prisma = prisma;
}


