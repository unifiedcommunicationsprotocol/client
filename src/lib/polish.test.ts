import { test, expect, describe, beforeEach } from "bun:test";
import { createOfflineQueue, createAIMetadata } from "./offline";
import { createAIMetadata as createAI } from "./ai";

describe("Phase 6: Polish & Optimization", () => {
  describe("Offline Queue Management", () => {
    let queue: ReturnType<typeof createOfflineQueue>;

    beforeEach(() => {
      queue = createOfflineQueue();
    });

    test("addToQueue creates queued message", () => {
      const id = queue.addToQueue({
        threadId: "thread_1",
        to: ["bob@example.com"],
        plaintext: "Test message",
        timestamp: Date.now(),
      });

      expect(id).toBeDefined();
      expect(id.startsWith("queued_")).toBe(true);
    });

    test("getQueuedMessage retrieves message", () => {
      const id = queue.addToQueue({
        threadId: "thread_1",
        to: ["bob@example.com"],
        plaintext: "Test",
        timestamp: Date.now(),
      });

      const msg = queue.getQueuedMessage(id);
      expect(msg?.threadId).toBe("thread_1");
      expect(msg?.status).toBe("queued");
    });

    test("listQueuedMessages returns all queued messages", () => {
      queue.addToQueue({
        threadId: "t1",
        to: ["bob@example.com"],
        plaintext: "msg1",
        timestamp: Date.now(),
      });

      queue.addToQueue({
        threadId: "t2",
        to: ["alice@example.com"],
        plaintext: "msg2",
        timestamp: Date.now(),
      });

      const messages = queue.listQueuedMessages();
      expect(messages.length).toBe(2);
    });

    test("removeFromQueue deletes message", () => {
      const id = queue.addToQueue({
        threadId: "t1",
        to: ["bob@example.com"],
        plaintext: "msg",
        timestamp: Date.now(),
      });

      queue.removeFromQueue(id);

      const msg = queue.getQueuedMessage(id);
      expect(msg).toBeUndefined();
    });

    test("incrementRetry updates status", () => {
      const id = queue.addToQueue({
        threadId: "t1",
        to: ["bob@example.com"],
        plaintext: "msg",
        timestamp: Date.now(),
      });

      queue.incrementRetry(id);
      let msg = queue.getQueuedMessage(id);
      expect(msg?.status).toBe("retrying");
      expect(msg?.retryCount).toBe(1);

      queue.incrementRetry(id);
      queue.incrementRetry(id);
      msg = queue.getQueuedMessage(id);
      expect(msg?.status).toBe("failed");
    });

    test("setOnlineStatus tracks connection", () => {
      expect(queue.getOnlineStatus()).toBe(true); // Default online

      queue.setOnlineStatus(false);
      expect(queue.getOnlineStatus()).toBe(false);

      queue.setOnlineStatus(true);
      expect(queue.getOnlineStatus()).toBe(true);
    });

    test("getOfflineState returns queue metrics", () => {
      queue.addToQueue({
        threadId: "t1",
        to: ["bob@example.com"],
        plaintext: "msg1",
        timestamp: Date.now(),
      });

      queue.addToQueue({
        threadId: "t2",
        to: ["alice@example.com"],
        plaintext: "msg2",
        timestamp: Date.now(),
      });

      const state = queue.getOfflineState();

      expect(state.isOnline).toBe(true);
      expect(state.queuedMessageCount).toBe(2);
      expect(state.pendingMessageCount).toBe(2);
    });

    test("clearQueue removes all messages", () => {
      queue.addToQueue({
        threadId: "t1",
        to: ["bob@example.com"],
        plaintext: "msg",
        timestamp: Date.now(),
      });

      queue.clearQueue();

      const messages = queue.listQueuedMessages();
      expect(messages.length).toBe(0);
    });
  });

  describe("AI Metadata: Thread Management", () => {
    let ai: ReturnType<typeof createAI>;

    beforeEach(() => {
      ai = createAI();
    });

    test("setThreadMetadata stores metadata", () => {
      ai.setThreadMetadata({
        threadId: "t1",
        summary: "Meeting notes",
        category: "work",
        lastUpdated: Date.now(),
      });

      const metadata = ai.getThreadMetadata("t1");
      expect(metadata?.summary).toBe("Meeting notes");
      expect(metadata?.category).toBe("work");
    });

    test("updateThreadCategory changes category", () => {
      ai.setThreadMetadata({
        threadId: "t1",
        category: "work",
        lastUpdated: Date.now(),
      });

      ai.updateThreadCategory("t1", "personal");

      const metadata = ai.getThreadMetadata("t1");
      expect(metadata?.category).toBe("personal");
    });

    test("addThreadLabel adds label", () => {
      ai.setThreadMetadata({
        threadId: "t1",
        labels: ["important"],
        lastUpdated: Date.now(),
      });

      ai.addThreadLabel("t1", "archived");

      const metadata = ai.getThreadMetadata("t1");
      expect(metadata?.labels).toContain("important");
      expect(metadata?.labels).toContain("archived");
    });

    test("removeThreadLabel removes label", () => {
      ai.setThreadMetadata({
        threadId: "t1",
        labels: ["important", "archived"],
        lastUpdated: Date.now(),
      });

      ai.removeThreadLabel("t1", "archived");

      const metadata = ai.getThreadMetadata("t1");
      expect(metadata?.labels).toContain("important");
      expect(metadata?.labels).not.toContain("archived");
    });

    test("setThreadSummary updates summary", () => {
      ai.setThreadMetadata({
        threadId: "t1",
        lastUpdated: Date.now(),
      });

      ai.setThreadSummary("t1", "New summary");

      const metadata = ai.getThreadMetadata("t1");
      expect(metadata?.summary).toBe("New summary");
    });
  });

  describe("AI Metadata: Content Analysis", () => {
    let ai: ReturnType<typeof createAI>;

    beforeEach(() => {
      ai = createAI();
    });

    test("detectActionItems finds TODO items", () => {
      const text =
        "Hey, TODO: implement feature X. Also FIXME: check bug Y.";
      const items = ai.detectActionItems(text);

      expect(items.length).toBeGreaterThan(0);
      expect(items.some((i) => i.includes("feature"))).toBe(true);
    });

    test("detectActionItems finds requests", () => {
      const text = "Can you review the PR? Please update the docs.";
      const items = ai.detectActionItems(text);

      expect(items.length).toBeGreaterThan(0);
    });

    test("detectSentiment detects positive", () => {
      const text = "This is great! I love it.";
      const sentiment = ai.detectSentiment(text);

      expect(sentiment).toBe("positive");
    });

    test("detectSentiment detects negative", () => {
      const text = "This is terrible. I hate it.";
      const sentiment = ai.detectSentiment(text);

      expect(sentiment).toBe("negative");
    });

    test("detectSentiment detects neutral", () => {
      const text = "The meeting is tomorrow at 2pm.";
      const sentiment = ai.detectSentiment(text);

      expect(sentiment).toBe("neutral");
    });

    test("generateThreadSummary creates summary", () => {
      const text =
        "This is the main point. Additional details here. TODO: follow up.";
      const summary = ai.generateThreadSummary(text);

      expect(summary).toBeDefined();
      expect(summary.length).toBeLessThanOrEqual(200);
    });

    test("generateThreadSummary includes action items", () => {
      const text = "Let me know about this. TODO: send report.";
      const summary = ai.generateThreadSummary(text);

      expect(summary).toContain("Items");
    });
  });

  describe("AI Metadata: Message Management", () => {
    let ai: ReturnType<typeof createAI>;

    beforeEach(() => {
      ai = createAI();
    });

    test("setMessageMetadata stores message metadata", () => {
      ai.setMessageMetadata({
        messageId: "msg_1",
        sentiment: "positive",
        tone: "casual",
        lastUpdated: Date.now(),
      });

      const metadata = ai.getMessageMetadata("msg_1");
      expect(metadata?.sentiment).toBe("positive");
      expect(metadata?.tone).toBe("casual");
    });

    test("getMessageMetadata returns undefined for missing", () => {
      const metadata = ai.getMessageMetadata("nonexistent");
      expect(metadata).toBeUndefined();
    });
  });

  describe("Integration: Offline + AI", () => {
    test("offline messages can have AI metadata", () => {
      const queue = createOfflineQueue();
      const ai = createAI();

      const msgId = queue.addToQueue({
        threadId: "t1",
        to: ["bob@example.com"],
        plaintext: "Great idea! TODO: implement it.",
        timestamp: Date.now(),
      });

      const msg = queue.getQueuedMessage(msgId);
      expect(msg?.plaintext).toBeDefined();

      // Analyze plaintext for AI metadata
      const sentiment = ai.detectSentiment(msg!.plaintext);
      const actionItems = ai.detectActionItems(msg!.plaintext);

      expect(sentiment).toBe("positive");
      expect(actionItems.length).toBeGreaterThan(0);
    });
  });
});
