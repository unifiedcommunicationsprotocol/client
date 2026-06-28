import { Hono } from "hono";
import { z } from "zod";
import type { Messaging } from "../../lib/messaging";

const CreateThreadSchema = z.object({
  participants: z.array(z.string()),
  subject: z.string().optional(),
});

export function createThreadsRoutes(messaging: Messaging) {
  const routes = new Hono();

  // POST /api/thread/create - Create a new thread
  routes.post("/create", async (c) => {
    try {
      const body = await c.req.json();
      const validated = CreateThreadSchema.parse(body);

      const thread = await messaging.createThread(
        validated.participants,
        validated.subject,
      );

      return c.json(
        { success: true, thread },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({ error: error.message }, { status: 400 });
      }
      if (error instanceof Error) {
        return c.json({ error: error.message }, { status: 500 });
      }
      return c.json({ error: "Unknown error" }, { status: 500 });
    }
  });

  // GET /api/thread/list - List all threads
  routes.get("/list", async (c) => {
    try {
      const limit = c.req.query("limit")
        ? parseInt(c.req.query("limit")!, 10)
        : undefined;

      const threads = await messaging.listThreads(limit);
      return c.json({ success: true, threads });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, { status: 500 });
      }
      return c.json({ error: "Unknown error" }, { status: 500 });
    }
  });

  // GET /api/thread/:threadId - Get a single thread
  routes.get("/:threadId", async (c) => {
    try {
      const threadId = c.req.param("threadId");

      const thread = await messaging.getThread(threadId);
      if (!thread) {
        return c.json({ error: "Thread not found" }, { status: 404 });
      }

      return c.json({ success: true, thread });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, { status: 500 });
      }
      return c.json({ error: "Unknown error" }, { status: 500 });
    }
  });

  return routes;
}

export default createThreadsRoutes;
