import { Hono } from "hono";
import authRoutes from "./routes/auth";
import healthRoutes from "./routes/health";

// API gateway - mount all route groups
const api = new Hono();

api.route("/auth", authRoutes);
api.route("/health", healthRoutes);

// Catch-all for unmatched API routes
api.all("*", (c) => {
  return c.json({ error: "Not Found" }, { status: 404 });
});

export default api;
