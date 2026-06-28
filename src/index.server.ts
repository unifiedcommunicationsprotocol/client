import { serve } from "bun";
import api from "./server/api";

const PORT = parseInt(process.env.PORT || "3000", 10);

serve({
  async fetch(req: Request) {
    const url = new URL(req.url);

    // Route API requests to Hono (strip /api prefix)
    if (url.pathname.startsWith("/api")) {
      const path = url.pathname.replace(/^\/api/, "");
      const newUrl = new URL(req.url);
      newUrl.pathname = path || "/";
      const newReq = new Request(newUrl, {
        method: req.method,
        headers: req.headers,
        body: req.method !== "GET" ? req.body : undefined,
      });
      return api.fetch(newReq);
    }

    // Fallback to 404
    return new Response("Not Found", { status: 404 });
  },
  port: PORT,
});
