import { Hono } from "hono";
import { createAuthRoutes } from "./routes/auth";
import healthRoutes from "./routes/health";
import { createMessagesRoutes } from "./routes/messages";
import { createThreadsRoutes } from "./routes/threads";
import { createWebSocketRoutes } from "./routes/websocket";
import { createMemoryDBClient } from "../lib/db/client";
import { createPostgresDBClient } from "../lib/db/postgres";
import { createMessaging } from "../lib/messaging";
import { broadcastMessage } from "../index.server";

// Initialize database and messaging service
// Use PostgreSQL if DATABASE_URL is set, otherwise use in-memory for testing
let db;
try {
  if (process.env.DATABASE_URL) {
    console.log("[DB] Initializing PostgreSQL client...");
    db = createPostgresDBClient();
    console.log("[DB] Connected to PostgreSQL");
  } else {
    console.log("[DB] DATABASE_URL not set, using in-memory client");
    db = createMemoryDBClient();
  }
} catch (error) {
  console.warn(
    "[DB] PostgreSQL connection failed, falling back to in-memory:",
    error instanceof Error ? error.message : error
  );
  db = createMemoryDBClient();
}

// Stub transport for now (will be upgraded to real WebSocket)
const stubTransport = {
  isReady: () => false,
  send: (_msg: unknown) => {},
};

const messaging = createMessaging(db, stubTransport as any);

// Wire messaging events to WebSocket broadcast
messaging.events.on((event) => {
  if (event.type === "message:received" || event.type === "message:status") {
    const message = event.data as any;
    if (message.threadId) {
      broadcastMessage(message.threadId, {
        type: event.type,
        data: message,
      });
    }
  }
});

// API gateway - mount all route groups
const api = new Hono();

api.route("/auth", createAuthRoutes(db));
api.route("/health", healthRoutes);
api.route("/message", createMessagesRoutes(messaging));
api.route("/thread", createThreadsRoutes(messaging));
api.route("/ws", createWebSocketRoutes(messaging));

// Catch-all for unmatched API routes
api.all("*", (c) => {
  return c.json({ error: "Not Found" }, { status: 404 });
});

export default api;
