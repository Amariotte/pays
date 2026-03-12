import { NextResponse } from "next/server";

export interface ProblemDetails {
  type:     string;
  title:    string;
  status:   number;
  detail:   string | null;  // ✅ le type est déclaré dans l'interface
  instance: string;
  "invalid-params" ?: InvalidParam[];
}

export interface InvalidParam {
  name:     string;
  reason:    string;
}

// map status → titre par défaut
const statusTitles: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  422: "Unprocessable Entity",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};

export function problemDetails({ status, detail, instance, type }: Partial<ProblemDetails>) {
  const titleFromStatus = status ? statusTitles[status] : undefined;

  return NextResponse.json(
    {
      type:     type     ?? `https://httpstatuses.io/${status}`,
      title: titleFromStatus ?? "Error",
      status,
      detail,
      instance: instance ?? '/api/pays',
    },
    {
      status,
      headers: { 'Content-Type': 'application/problem+json' },
    }
  );
}

export function BadRequest({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 400, detail, instance, type }
  );
}

export function NotFound({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 404, detail, instance, type }
  );
}

export function InternalServerError({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 500, detail, instance, type }
  );
}

export function Unauthorized({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 401, detail, instance, type }
  );
}

export function Conflict({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 409, detail, instance, type }
  );
}