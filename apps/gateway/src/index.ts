import type { ApiError } from "@aquavillae/contract";
import { googleCalendarProvider } from "./providers/google-calendar";
import type { BookingProvider } from "./providers/types";
import { QuoteError } from "./quote";

const provider: BookingProvider = googleCalendarProvider;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

export default {
  async fetch(request: Request): Promise<Response> {
    const { pathname } = new URL(request.url);
    try {
      if (request.method === "POST") {
        const body = await request.json<any>();
        if (pathname === "/availability") return json(await provider.availability(body));
        if (pathname === "/quote") return json(await provider.quote(body));
        if (pathname === "/request") return json(await provider.request(body));
      }
      return json({ error: "not_found", message: "Rota inexistente" } satisfies ApiError, 404);
    } catch (e) {
      if (e instanceof QuoteError) return json({ error: e.code, message: e.message } satisfies ApiError, 400);
      return json({ error: "internal", message: (e as Error).message } satisfies ApiError, 500);
    }
  },
};
