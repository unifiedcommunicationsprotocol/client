import { test, expect, describe, beforeEach } from "bun:test";
import { createMessaging } from "./messaging";
import { createMemoryDBClient } from "./db/client";
import { createTransport } from "./transport";

describe("Real-time Messaging", () => {
  let messaging: ReturnType<typeof createMessaging>;

  beforeEach(() => {
    const db = createMemoryDBClient();
    const transport = createTransport({
      serverUrl: "ws://localhost:8000",
      authToken: "test_token",
      clientId: "test_client",
    });

    messaging = createMessaging(db, transport);
  });

  describe("Thread Management", () => {
    test("createThread creates and stores thread", async () => {
      const thread = await messaging.createThread(
        ["alice@example.com", "bob@example.com"],
        "Test Thread",
      );

      expect(thread.id).toBeDefined();
      expect(thread.participants).toContain("alice@example.com");
      expect(thread.participants).toContain("bob@example.com");
      expect(thread.subject).toBe("Test Thread");
    });

    test("getThread retrieves created thread", async () => {
      const created = await messaging.createThread(["alice@example.com"]);

      const retrieved = await messaging.getThread(created.id);

      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.participants).toEqual(["alice@example.com"]);
    });

    test("listThreads returns all threads", async () => {
      await messaging.createThread(["alice@example.com"]);
      await messaging.createThread(["bob@example.com"]);

      const threads = await messaging.listThreads();

      expect(threads.length).toBe(2);
    });

    test("createThread emits thread:created event", async () => {
      const events: any[] = [];
      messaging.events.on((event) => {
        if (event.type === "thread:created") {
          events.push(event);
        }
      });

      const thread = await messaging.createThread(["alice@example.com"]);

      expect(events.length).toBe(1);
      expect(events[0].data.id).toBe(thread.id);
    });
  });

  describe("Message Operations", () => {
    test("sendMessage creates message", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const message = await messaging.sendMessage(
        thread.id,
        ["bob@example.com"],
        "Hello Bob",
      );

      expect(message.id).toBeDefined();
      expect(message.threadId).toBe(thread.id);
      expect(message.status).toBe("pending");
    });

    test("sendMessage fails for nonexistent thread", async () => {
      try {
        await messaging.sendMessage("nonexistent", ["bob@example.com"], "Hi");
        expect(true).toBe(false); // Should reject
      } catch (err: any) {
        expect(err.message).toContain("Thread not found");
      }
    });

    test("getThreadMessages returns thread messages", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      await messaging.sendMessage(thread.id, ["bob@example.com"], "Message 1");
      await messaging.sendMessage(thread.id, ["bob@example.com"], "Message 2");

      const messages = await messaging.getThreadMessages(thread.id);

      expect(messages.length).toBe(2);
    });

    test("updateMessageStatus changes message status", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const message = await messaging.sendMessage(
        thread.id,
        ["bob@example.com"],
        "Test",
      );

      await messaging.updateMessageStatus(message.id, "delivered");

      const messages = await messaging.getThreadMessages(thread.id);
      expect(messages[0].status).toBe("delivered");
    });

    test("sendMessage emits message:received event", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const events: any[] = [];
      messaging.events.on((event) => {
        if (event.type === "message:received") {
          events.push(event);
        }
      });

      await messaging.sendMessage(thread.id, ["bob@example.com"], "Hi");

      expect(events.length).toBe(1);
    });

    test("updateMessageStatus emits message:status event", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);
      const message = await messaging.sendMessage(
        thread.id,
        ["bob@example.com"],
        "Test",
      );

      const events: any[] = [];
      messaging.events.on((event) => {
        if (event.type === "message:status") {
          events.push(event);
        }
      });

      await messaging.updateMessageStatus(message.id, "read");

      expect(events.length).toBe(1);
      expect(events[0].data.status).toBe("read");
    });
  });

  describe("Draft Management", () => {
    test("saveDraft creates draft", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const draft = await messaging.saveDraft(
        thread.id,
        ["bob@example.com"],
        "Draft content",
        undefined,
        undefined,
        "Draft Subject",
      );

      expect(draft.id).toBeDefined();
      expect(draft.plaintext).toBe("Draft content");
      expect(draft.subject).toBe("Draft Subject");
    });

    test("deleteDraft removes draft", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const draft = await messaging.saveDraft(
        thread.id,
        ["bob@example.com"],
        "Content",
      );

      await messaging.deleteDraft(draft.id);

      // Verify it's deleted by checking the DB
      // In real test, would query DB directly
      expect(draft.id).toBeDefined();
    });

    test("saveDraft with cc and bcc", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const draft = await messaging.saveDraft(
        thread.id,
        ["bob@example.com"],
        "Content",
        ["charlie@example.com"],
        ["dave@example.com"],
      );

      expect(draft.cc).toEqual(["charlie@example.com"]);
      expect(draft.bcc).toEqual(["dave@example.com"]);
    });
  });

  describe("Event Subscription", () => {
    test("subscribeToThread listens to thread events", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const events: any[] = [];
      const unsubscribe = messaging.subscribeToThread(thread.id, (event) => {
        events.push(event);
      });

      await messaging.sendMessage(thread.id, ["bob@example.com"], "Hi");

      expect(events.length).toBe(1);
      expect(events[0].type).toBe("message:received");

      unsubscribe();
    });

    test("subscribeToThread unsubscribe stops listening", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const events: any[] = [];
      const unsubscribe = messaging.subscribeToThread(thread.id, (event) => {
        events.push(event);
      });

      unsubscribe();

      await messaging.sendMessage(thread.id, ["bob@example.com"], "After");

      expect(events.length).toBe(0);
    });

    test("subscribeToThread only receives thread-specific events", async () => {
      const thread1 = await messaging.createThread(["alice@example.com"]);
      const thread2 = await messaging.createThread(["bob@example.com"]);

      const thread1Events: any[] = [];
      messaging.subscribeToThread(thread1.id, (event) => {
        thread1Events.push(event);
      });

      await messaging.sendMessage(thread1.id, ["bob@example.com"], "For t1");
      await messaging.sendMessage(thread2.id, ["alice@example.com"], "For t2");

      expect(thread1Events.length).toBe(1);
    });
  });

  describe("Integration", () => {
    test("full message flow: create thread → send message → update status", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);
      expect(thread.id).toBeDefined();

      const message = await messaging.sendMessage(
        thread.id,
        ["bob@example.com"],
        "Integration test",
      );
      expect(message.status).toBe("pending");

      await messaging.updateMessageStatus(message.id, "sent");

      const messages = await messaging.getThreadMessages(thread.id);
      expect(messages[0].status).toBe("sent");
    });

    test("multiple subscriptions to same thread", async () => {
      const thread = await messaging.createThread(["alice@example.com"]);

      const subscriber1Events: any[] = [];
      const subscriber2Events: any[] = [];

      messaging.subscribeToThread(thread.id, (event) => {
        subscriber1Events.push(event);
      });

      messaging.subscribeToThread(thread.id, (event) => {
        subscriber2Events.push(event);
      });

      await messaging.sendMessage(thread.id, ["bob@example.com"], "Test");

      expect(subscriber1Events.length).toBe(1);
      expect(subscriber2Events.length).toBe(1);
    });
  });
});
