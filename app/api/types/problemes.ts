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

export function problemDetails({ status, title, detail, instance, type }: Partial<ProblemDetails>) {
  return NextResponse.json(
    {
      type:     type     ?? `https://httpstatuses.io/${status}`,
      title,
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
  return problemDetails({ status: 400, title: "Bad Request", detail, instance, type }
  );
}

export function NotFound({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 404, title: "Not Found", detail, instance, type }
  );
}
export function InternalServerError({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 500, title: "Internal Server Error", detail, instance, type }
  );
}
export function Unauthorized({ detail, instance, type }: Partial<ProblemDetails>) {
  return problemDetails({ status: 401, title: "Unauthorized", detail, instance, type }
  );
}