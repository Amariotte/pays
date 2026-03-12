// lib/withCors.ts

import { corsHeaders } from "@/lib/cors";

export function withCors(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }
    const res = await handler(req);
    res.headers.set("Access-Control-Allow-Origin", corsHeaders["Access-Control-Allow-Origin"]);
    return res;
  };
}