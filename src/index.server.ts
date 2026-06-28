import { serve } from "bun";
import homepage from "./index.html";
import api from "./server/api";

const PORT = parseInt(process.env.PORT || "3000", 10);

serve({
  routes: {
    "/*": homepage,
    "/api/*": api.fetch,
  },
  fetch(_req) {
    return new Response("Not Found", { status: 404 });
  },
  port: PORT,
  development: {
    hmr: true,
  },
});
