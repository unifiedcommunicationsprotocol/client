import { Hono } from "hono";

// UCP Client Server
// Full-stack Bun executable: serves API + React frontend on same port
// Development: Hot module reloading enabled
// Production: Static build from dist/

const app = new Hono();
const PORT = parseInt(process.env.PORT || "3000", 10);
const isDev = process.env.NODE_ENV !== "production";

// API Routes
app.post("/api/auth/challenge", async (c) => {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  return c.json({
    challenge: Buffer.from(challenge).toString("base64"),
  });
});

app.post("/api/auth/session", async (c) => {
  return c.json({
    session_token: crypto.randomUUID(),
    expires_at: Date.now() + 24 * 60 * 60 * 1000,
  });
});

app.get("/api/hello", async (c) => {
  return c.json({
    message: "UCP Client API",
    method: "GET",
    timestamp: new Date().toISOString(),
  });
});

app.put("/api/hello", async (c) => {
  return c.json({
    message: "UCP Client API",
    method: "PUT",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/hello/:name", async (c) => {
  const name = c.req.param("name");
  return c.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", async (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Frontend routes (SPA)
app.get("*", async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>🔐 Relay — UCP Client</title>
      </head>
      <body>
        <div id="root"></div>
        ${isDev ? `<script type="module" src="/src/index.client.tsx"></script>` : `<script type="module" src="/app.js"></script>`}
      </body>
    </html>
  `);
});

console.log(
  `🚀 Relay Client ${isDev ? "(development)" : "(production)"} running at http://localhost:${PORT}`,
);
console.log(`   Frontend: http://localhost:${PORT}`);
console.log(`   API: http://localhost:${PORT}/api`);

export default {
  port: PORT,
  fetch: app.fetch,
  development: isDev && {
    hmr: true,
  },
};
