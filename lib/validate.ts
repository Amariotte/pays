import { ZodSchema } from "zod";
import { NextResponse } from "next/server";
import { problemDetails } from "@/app/api/types/problemes";

export function validate<T>(schema: ZodSchema<T>,data: unknown): | { success: true; data: T }| { success: false; error: NextResponse } {

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const detail = result.error.issues
  .map((e) => `${e.path.join(".")} : ${e.message}`)
  .join(", ");

  return {
    success: false,
    error: problemDetails({
      status: 400,
      title: "Données invalides",
      detail,
    }),
  };
}