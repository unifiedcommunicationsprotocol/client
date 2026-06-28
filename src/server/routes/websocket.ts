import { Hono } from "hono";
import type { Messaging } from "../../lib/messaging";

/**
 * WebSocket routes (HTTP endpoints)
 * The actual WebSocket upgrade is handled at the serve() level in index.server.ts
 * This just provides an info endpoint
 */
export function createWebSocketRoutes(_messaging: Messaging) {
  const routes = new Hono();

  /**
   * GET /api/ws/subscribe?threadId=...
   * Returns information about the WebSocket endpoint
   * The actual upgrade happens at the server level
   */
  routes.get("/subscribe", (c) => {
    const threadId = c.req.query("threadId");
    if (!threadId) {
      return c.text("threadId query parameter required", 400);
    }

    return c.json({
      message: "WebSocket subscription endpoint",
      threadId,
      instructions:
        "Connect via WebSocket at ws://host:port/api/ws/subscribe?threadId=...",
      status: "ready",
    });
  });

  /**
   * GET /api/ws/status
   * Check WebSocket server status
   */
  routes.get("/status", (c) => {
    return c.json({
      websocket: "enabled",
      protocol: "RFC 6455",
      endpoint: "/api/ws/subscribe?threadId=...",
    });
  });

  return routes;
}

export default createWebSocketRoutes;
