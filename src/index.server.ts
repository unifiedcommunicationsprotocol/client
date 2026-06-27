import { serve } from "bun";
import api from "./server/api";

const PORT = parseInt(process.env.PORT || "3000", 10);
const isDev = process.env.NODE_ENV !== "production";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🔐 Relay — UCP Client</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/app.js"></script>
  </body>
</html>`;

serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);

    // API routes
    if (url.pathname.startsWith("/api")) {
      const rewrittenUrl = new URL(req.url);
      rewrittenUrl.pathname = rewrittenUrl.pathname.slice(4); // Remove "/api"
      return api.fetch(new Request(rewrittenUrl, req));
    }

    // Serve HTML for all other routes (SPA)
    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  },
  development: isDev && {
    hmr: true,
  },
});
