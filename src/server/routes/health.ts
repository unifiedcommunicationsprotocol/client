import { Hono } from "hono";

const healthRoutes = new Hono();

// GET /api/health - Health check
healthRoutes.get("/", async (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "ucp/1.0",
  });
});

export default healthRoutes;
