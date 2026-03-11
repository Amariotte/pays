import { prisma } from '@/lib/prisma';
import { createCrudRoutes } from '@/lib/crud-factory';
import { createPaysSchema, updatePaysSchema } from '../validators/all.validator';

export const paysRoutes = createCrudRoutes({
  resource: 'pays',
  model: prisma.pays,
  createSchema: createPaysSchema,
  updateSchema: updatePaysSchema,
  searchField: 'nom',
  orderBy: { id: 'asc' },
});
