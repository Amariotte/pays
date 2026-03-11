import { prisma } from '@/lib/prisma';
import { createCrudRoutes } from '@/lib/crud-factory';
import { createContinentSchema, updateContinentSchema } from '../validators/all.validator';

export const continentRoutes = createCrudRoutes({
  resource: 'continent',
  model: prisma.continent,
  createSchema: createContinentSchema,
  updateSchema: updateContinentSchema,
  searchField: 'nom',
  orderBy: { id: 'asc' },
});
