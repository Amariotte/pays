import { NextResponse, type NextRequest } from 'next/server';
import { ZodSchema } from 'zod';
import { withAuth } from '@/lib/auth-middleware';
import { validate } from '@/lib/validate';
import { idParamSchema } from '@/app/api/validators/all.validator';
import { InternalServerError, NotFound, problemDetails } from '@/app/api/types/problemes';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CrudConfig<TDto> {
  resource: string;                         // ex: 'pays'
  model: any;                               // prisma.pays
  toDto?: (row: any) => TDto;               // fonction DTO facultative
  createSchema: ZodSchema;                  // schéma Zod création
  updateSchema: ZodSchema;                  // schéma Zod mise à jour
  searchField: string;                       // champ unicité / recherche
  orderBy?: Record<string, 'asc' | 'desc'>; // tri par défaut
}

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) => Promise<NextResponse>;

interface CrudRoutes<TDto> {
  GET_ALL: (request: NextRequest) => Promise<NextResponse>;
  POST: (request: NextRequest) => Promise<NextResponse>;
  GET: RouteHandler;
  PUT: RouteHandler;
  DELETE: RouteHandler;
}

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createCrudRoutes<TDto>(config: CrudConfig<TDto>): CrudRoutes<TDto> {
  const { resource, model, toDto, createSchema, updateSchema, searchField, orderBy } = config;
  const instance = (id?: number) => `/api/${resource}${id ? `/${id}` : ''}`;

  // ── Helpers ───────────────────────────────────────────────
  const mapRow = (row: any) => (typeof toDto === 'function' ? toDto(row) : row);
  const mapRows = (rows: any[]) => (typeof toDto === 'function' ? rows.map(toDto) : rows);

  async function findById(id: number) {
    return model.findFirst({ where: { id } });
  }

  async function checkUnique(value: string, excludeId?: number) {
    return model.findFirst({
      where: {
        [searchField]: value,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  }

  // ── GET ALL ───────────────────────────────────────────────
 const GET_ALL = withAuth(async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search');
    const sort = searchParams.get('sort') ?? Object.keys(orderBy ?? { id: 'asc' })[0];
    const order = searchParams.get('order') === 'desc' ? 'desc' : 'asc';

    // validation du tri
    if (orderBy && !Object.keys(orderBy).includes(sort)) {
      return problemDetails({
        status: 400,
        title: 'Paramètre de tri invalide',
        detail: `Le champ "${sort}" n'est pas autorisé pour le tri.`,
      });
    }

    // filtre recherche globale
    const where: Record<string, any> = {};
    if (search) {
      where.OR = [{ [searchField]: { contains: search, mode: 'insensitive' } }];
    }

    // pagination
    const page = Number(searchParams.get('page') ?? 1);
    const limit = Number(searchParams.get('limit') ?? 10);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      model.findMany({ where, orderBy: { [sort]: order }, skip, take: limit }),
      model.count({ where }),
    ]);

    // Si toDto existe, on transforme, sinon on renvoie tel quel
    const data = typeof toDto === 'function' ? rows.map(toDto) : rows;

    return NextResponse.json({
      data,
      meta: { total, page, limit },
    });
  } catch (error: unknown) {
    return problemDetails({
      status: 500,
      title: `Impossible de récupérer les ${resource}`,
      detail: error instanceof Error ? error.message : String(error),
    });
  }
});
  // ── POST ──────────────────────────────────────────────────
  const POST = withAuth(async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json();
      const validation = validate(createSchema, body);
      if (!validation.success) return validation.error;

      const data = validation.data as Record<string, unknown>;
      const uniqueValue = data[searchField] as string;

      if (await checkUnique(uniqueValue)) {
        return problemDetails({
          status: 409,
          title: 'Conflit',
          detail: `Un élément "${uniqueValue}" existe déjà.`,
          instance: instance(),
        });
      }

      const created = await model.create({ data });
      return NextResponse.json(mapRow(created), { status: 201 });
    } catch (error: unknown) {
      return InternalServerError({
        detail: `Impossible de créer l'élément.` + (error instanceof Error ? ` Message: ${error.message}` : ''),
      });
    }
  });

  // ── GET ───────────────────────────────────────────────────
  async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> {
    try {
      const { id: idStr } = await params;
      const validation = validate(idParamSchema, { id: idStr });
      if (!validation.success) return validation.error;
      const { id } = validation.data;

      const row = await findById(id);
      if (!row) {
        return problemDetails({
          status: 404,
          title: 'Ressource introuvable',
          detail: `Aucun élément trouvé avec l'identifiant ${id}.`,
          instance: instance(id),
        });
      }

      return NextResponse.json(mapRow(row));
    } catch (error: unknown) {
      return problemDetails({
        status: 500,
        title: 'Erreur interne du serveur',
        detail: `Impossible de récupérer l'élément.` + (error instanceof Error ? ` Message: ${error.message}` : ''),
      });
    }
  }

  // ── PUT ───────────────────────────────────────────────────
  const PUT = withAuth(async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> => {
    try {
      const { id: idStr } = await params;
      const idValidation = validate(idParamSchema, { id: idStr });
      if (!idValidation.success) return idValidation.error;
      const { id } = idValidation.data;

      const body = await request.json();
      const bodyValidation = validate(updateSchema, body);
      if (!bodyValidation.success) return bodyValidation.error;

      const data = bodyValidation.data as Record<string, unknown>;
      const uniqueValue = data[searchField] as string | undefined;

      const row = await findById(id);
      if (!row) {
        return problemDetails({
          status: 404,
          title: 'Ressource introuvable',
          detail: `Aucun élément trouvé avec l'identifiant ${id}.`,
          instance: instance(id),
        });
      }

      if (uniqueValue && (await checkUnique(uniqueValue, id))) {
        return problemDetails({
          status: 409,
          title: 'Conflit',
          detail: `Un autre élément avec la valeur "${uniqueValue}" existe déjà.`,
        });
      }

      const updated = await model.update({ where: { id }, data });
      return NextResponse.json(mapRow(updated));
    } catch (error: unknown) {
      return InternalServerError({
        detail: `Impossible de mettre à jour l'élément.` + (error instanceof Error ? ` Message: ${error.message}` : ''),
      });
    }
  });

  // ── DELETE ────────────────────────────────────────────────
  const DELETE = withAuth(async (
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> => {
    try {
      const { id: idStr } = await params;
      const validation = validate(idParamSchema, { id: idStr });
      if (!validation.success) return validation.error;
      const { id } = validation.data;

      const row = await findById(id);
      if (!row) {
        return NotFound({
          detail: `Aucun élément trouvé avec l'identifiant ${id}.`,
          instance: instance(id),
        });
      }

      await model.delete({ where: { id } });
      return new NextResponse(null, { status: 204 });
    } catch (error: unknown) {
      return problemDetails({
        status: 500,
        title: 'Erreur interne du serveur',
        detail: `Impossible de supprimer l'élément.` + (error instanceof Error ? ` Message: ${error.message}` : ''),
      });
    }
  });

  return { GET_ALL, POST, GET, PUT, DELETE };
}