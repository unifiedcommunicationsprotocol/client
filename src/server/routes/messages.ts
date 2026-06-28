import { Hono } from "hono";
import { z } from "zod";
import type { Messaging } from "../../lib/messaging";

const SendMessageSchema = z.object({
  threadId: z.string(),
  to: z.array(z.string()),
  plaintext: z.string(),
  cc: z.array(z.string()).optional(),
  bcc: z.array(z.string()).optional(),
});


export function createMessagesRoutes(messaging: Messaging) {
  const routes = new Hono();

  // POST /api/message/send - Send a new message
  routes.post("/send", async (c) => {
    try {
      const body = await c.req.json();
      const validated = SendMessageSchema.parse(body);

      const message = await messaging.sendMessage(
        validated.threadId,
        validated.to,
        validated.plaintext,
        validated.cc,
        validated.bcc,
      );

      return c.json(
        { success: true, message },
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

  // GET /api/message/list - List messages for a thread
  routes.get("/list", async (c) => {
    try {
      const threadId = c.req.query("threadId");
      const limit = c.req.query("limit")
        ? parseInt(c.req.query("limit")!, 10)
        : 50;

      if (!threadId) {
        return c.json({ error: "threadId required" }, { status: 400 });
      }

      const messages = await messaging.getThreadMessages(threadId, limit);
      return c.json({ success: true, messages });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, { status: 500 });
      }
      return c.json({ error: "Unknown error" }, { status: 500 });
    }
  });

  // PUT /api/message/status - Update message status (read, delivered, etc.)
  routes.put("/status/:messageId", async (c) => {
    try {
      const messageId = c.req.param("messageId");
      const body = await c.req.json();

      const status = body.status as
        | "pending"
        | "sent"
        | "delivered"
        | "read";
      if (!["pending", "sent", "delivered", "read"].includes(status)) {
        return c.json({ error: "Invalid status" }, { status: 400 });
      }

      await messaging.updateMessageStatus(messageId, status);
      return c.json({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, { status: 500 });
      }
      return c.json({ error: "Unknown error" }, { status: 500 });
    }
  });

  return routes;
}

export default createMessagesRoutes;
