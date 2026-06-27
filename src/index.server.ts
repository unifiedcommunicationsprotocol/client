import { serve } from "bun";
import indexHtml from "./index.html";
import api from "./server/api";

const PORT = parseInt(process.env.PORT || "3000", 10);
const isDev = process.env.NODE_ENV !== "production";

serve({
  port: PORT,
  routes: {
    "/*": indexHtml,
    "/api/*": api.fetch,
  },
  development: isDev && {
    hmr: true,
  },
});
