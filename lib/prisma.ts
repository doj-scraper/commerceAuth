// lib/prisma.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const rawConnectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
const connectionString = rawConnectionString.replace(/^"|"$|'/g, '').trim();

export const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter: new PrismaNeon(new Pool({ connectionString }) as any)
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
