import { PrismaClient ,} from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// ─── Types ───────────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// ─── Pool PostgreSQL ──────────────────────────────────────────────────────────

if (!process.env.DATABASE_URL) {
  throw new Error('La variable d\'environnement DATABASE_URL est manquante.'); // ✅ fail-fast au démarrage
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // ✅ PrismaPg attend un Pool, pas une string
});

// ─── Singleton Prisma ─────────────────────────────────────────────────────────

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaPg(pool),  // ✅ typage correct, plus de cast `as any`
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error'] // ✅ logs SQL visibles en dev
        : ['error'],
  });
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma; // ✅ globalThis préféré à global
}


export function getModelFields(modelName: string): string[] {
  const model = (prisma as any)._dmmf.modelMap[modelName];
  if (!model) return [];
  return model.fields.map((f: any) => f.name);
}