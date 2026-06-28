import { serve } from "bun";
import api from "./server/api";

const PORT = parseInt(process.env.PORT || "3000", 10);

// WebSocket subscription manager
interface SubscribedClient {
  ws: ServerWebSocket<{ threadId: string }>;
  threadId: string;
}
const subscribers = new Map<string, SubscribedClient[]>();

serve({
  async fetch(req: Request, server: Server) {
    const url = new URL(req.url);

    // Handle WebSocket upgrades
    if (url.pathname.startsWith("/api/ws/subscribe")) {
      const threadId = url.searchParams.get("threadId");
      if (!threadId) {
        return new Response("threadId required", { status: 400 });
      }

      const upgraded = server.upgrade(req, {
        data: { threadId },
      });

      if (upgraded) {
        console.log(`[WS] Client upgraded to WebSocket for thread: ${threadId}`);
        return undefined;
      }
      return new Response("WebSocket upgrade failed", { status: 500 });
    }

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

  websocket: {
    open(ws: ServerWebSocket<{ threadId: string }>) {
      const threadId = ws.data.threadId;

      // Add to subscribers
      if (!subscribers.has(threadId)) {
        subscribers.set(threadId, []);
      }

      const client: SubscribedClient = { ws, threadId };
      subscribers.get(threadId)!.push(client);

      // Send confirmation
      ws.send(
        JSON.stringify({
          type: "subscribed",
          threadId,
          timestamp: new Date().toISOString(),
        })
      );

      console.log(
        `[WS] Open: subscribed to ${threadId} (${subscribers.get(threadId)!.length} total)`
      );
    },

    message(ws: ServerWebSocket<{ threadId: string }>, message: string | Buffer) {
      try {
        const data = JSON.parse(message.toString());
        console.log(`[WS] Message from client on ${ws.data.threadId}:`, data.type);
        ws.send(JSON.stringify({ type: "ack", ...data }));
      } catch (e) {
        console.error("[WS] Failed to parse message:", e);
      }
    },

    close(ws: ServerWebSocket<{ threadId: string }>) {
      const threadId = ws.data.threadId;
      const clients = subscribers.get(threadId) || [];
      const index = clients.findIndex((c) => c.ws === ws);
      if (index >= 0) {
        clients.splice(index, 1);
      }
      console.log(
        `[WS] Close: disconnected from ${threadId} (${clients.length} remaining)`
      );
    },

    error(ws: ServerWebSocket<{ threadId: string }>, error: Error) {
      console.error(`[WS] Error on ${ws.data.threadId}:`, error);
    },
  },

  port: PORT,
});

// Export broadcast function for use by messaging service
export function broadcastMessage(
  threadId: string,
  event: { type: string; data: any }
) {
  const clients = subscribers.get(threadId) || [];
  if (clients.length === 0) return;

  console.log(
    `[WS] Broadcasting ${event.type} to ${clients.length} clients on thread ${threadId}`
  );

  const payload = JSON.stringify({
    ...event,
    timestamp: new Date().toISOString(),
  });

  for (const client of clients) {
    try {
      client.ws.send(payload);
    } catch (e) {
      console.error("[WS] Failed to send message:", e);
    }
  }
}
