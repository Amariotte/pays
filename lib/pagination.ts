// lib/pagination.ts

import { Meta } from "@/app/api/types/meta";

export function buildMeta(
  total:   number,
  page:    number,
  limit:   number,
): Meta {
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    page,
    limit,
    totalPages,
    next:     page < totalPages ? page + 1 : null,
    previous: page > 1      ? page - 1 : null,
  };
}