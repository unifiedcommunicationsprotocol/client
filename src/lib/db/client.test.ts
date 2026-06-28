import { test, expect, describe, beforeEach } from "bun:test";
import { createMemoryDBClient, type DBClient } from "./client";

describe("Database Client", () => {
  let db: DBClient;

  beforeEach(() => {
    db = createMemoryDBClient();
  });

  describe("Threads", () => {
    test("createThread stores and returns thread", async () => {
      const thread = await db.createThread({
        groupId: "group_123",
        participants: ["alice@example.com", "bob@example.com"],
      });

      expect(thread.id).toBeDefined();
      expect(thread.groupId).toBe("group_123");
      expect(thread.participants).toEqual([
        "alice@example.com",
        "bob@example.com",
      ]);
      expect(thread.createdAt).toBeDefined();
    });

    test("getThread retrieves stored thread", async () => {
      const created = await db.createThread({
        groupId: "group_test",
        participants: ["alice@example.com"],
      });

      const retrieved = await db.getThread(created.id);

      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.groupId).toBe("group_test");
    });

    test("getThread returns undefined for missing thread", async () => {
      const result = await db.getThread("nonexistent");
      expect(result).toBeUndefined();
    });

    test("listThreads returns all threads", async () => {
      await db.createThread({
        groupId: "group_1",
        participants: ["alice@example.com"],
      });
      await db.createThread({
        groupId: "group_2",
        participants: ["bob@example.com"],
      });

      const threads = await db.listThreads();

      expect(threads.length).toBe(2);
    });

    test("listThreads respects limit", async () => {
      for (let i = 0; i < 10; i++) {
        await db.createThread({
          groupId: `group_${i}`,
          participants: ["alice@example.com"],
        });
      }

      const threads = await db.listThreads(5);
      expect(threads.length).toBe(5);
    });

    test("updateThread modifies thread", async () => {
      const created = await db.createThread({
        groupId: "group_update",
        participants: ["alice@example.com"],
      });

      await db.updateThread(created.id, { subject: "New Subject" });

      const updated = await db.getThread(created.id);
      expect(updated?.subject).toBe("New Subject");
    });
  });

  describe("Messages", () => {
    test("createMessage stores message", async () => {
      const thread = await db.createThread({
        groupId: "group_msg",
        participants: ["alice@example.com"],
      });

      const message = await db.createMessage({
        threadId: thread.id,
        from: "alice@example.com",
        ciphertext: "encrypted_content",
        signature: "sig_123",
        clientTs: Date.now(),
      });

      expect(message.id).toBeDefined();
      expect(message.threadId).toBe(thread.id);
      expect(message.status).toBe("pending");
    });

    test("getMessage retrieves message", async () => {
      const thread = await db.createThread({
        groupId: "group_msg2",
        participants: ["alice@example.com"],
      });

      const created = await db.createMessage({
        threadId: thread.id,
        from: "alice@example.com",
        ciphertext: "content",
        signature: "sig",
        clientTs: Date.now(),
      });

      const retrieved = await db.getMessage(created.id);
      expect(retrieved?.id).toBe(created.id);
    });

    test("listThreadMessages returns messages for thread", async () => {
      const thread = await db.createThread({
        groupId: "group_multi_msg",
        participants: ["alice@example.com"],
      });

      await db.createMessage({
        threadId: thread.id,
        from: "alice@example.com",
        ciphertext: "msg1",
        signature: "sig1",
        clientTs: 100,
      });

      await db.createMessage({
        threadId: thread.id,
        from: "bob@example.com",
        ciphertext: "msg2",
        signature: "sig2",
        clientTs: 200,
      });

      const messages = await db.listThreadMessages(thread.id);
      expect(messages.length).toBe(2);
    });

    test("updateMessageStatus changes status", async () => {
      const thread = await db.createThread({
        groupId: "group_status",
        participants: ["alice@example.com"],
      });

      const message = await db.createMessage({
        threadId: thread.id,
        from: "alice@example.com",
        ciphertext: "content",
        signature: "sig",
        clientTs: Date.now(),
      });

      await db.updateMessageStatus(message.id, "delivered");

      const updated = await db.getMessage(message.id);
      expect(updated?.status).toBe("delivered");
    });
  });

  describe("Keys", () => {
    test("createKey stores key", async () => {
      const key = await db.createKey({
        address: "alice@example.com",
        keyType: "signing",
        publicKey: "pk_123",
        secretKeyEncrypted: "encrypted_sk",
      });

      expect(key.id).toBeDefined();
      expect(key.address).toBe("alice@example.com");
      expect(key.status).toBe("active");
    });

    test("getActiveKey returns active key for address", async () => {
      await db.createKey({
        address: "alice@example.com",
        keyType: "signing",
        publicKey: "pk_1",
        secretKeyEncrypted: "esk_1",
      });

      const key = await db.getActiveKey("alice@example.com");
      expect(key?.address).toBe("alice@example.com");
      expect(key?.status).toBe("active");
    });

    test("listKeysByAddress returns all keys for address", async () => {
      const addr = "alice@example.com";
      await db.createKey({
        address: addr,
        keyType: "signing",
        publicKey: "pk_1",
        secretKeyEncrypted: "esk_1",
      });
      await db.createKey({
        address: addr,
        keyType: "identity",
        publicKey: "pk_2",
        secretKeyEncrypted: "esk_2",
      });

      const keys = await db.listKeysByAddress(addr);
      expect(keys.length).toBe(2);
    });

    test("updateKeyStatus changes key status", async () => {
      const key = await db.createKey({
        address: "alice@example.com",
        keyType: "signing",
        publicKey: "pk_123",
        secretKeyEncrypted: "esk_123",
      });

      await db.updateKeyStatus(key.id, "expired");

      const updated = await db.getActiveKey("alice@example.com");
      expect(updated).toBeUndefined(); // Active key not found
    });
  });

  describe("Drafts", () => {
    test("createDraft stores draft", async () => {
      const thread = await db.createThread({
        groupId: "group_draft",
        participants: ["alice@example.com"],
      });

      const draft = await db.createDraft({
        threadId: thread.id,
        to: ["bob@example.com"],
        plaintext: "Draft content",
      });

      expect(draft.id).toBeDefined();
      expect(draft.threadId).toBe(thread.id);
    });

    test("getDraft retrieves draft", async () => {
      const thread = await db.createThread({
        groupId: "group_draft2",
        participants: ["alice@example.com"],
      });

      const created = await db.createDraft({
        threadId: thread.id,
        to: ["bob@example.com"],
        plaintext: "Content",
      });

      const retrieved = await db.getDraft(created.id);
      expect(retrieved?.id).toBe(created.id);
    });

    test("listDraftsByThread returns drafts for thread", async () => {
      const thread = await db.createThread({
        groupId: "group_draft_list",
        participants: ["alice@example.com"],
      });

      await db.createDraft({
        threadId: thread.id,
        to: ["bob@example.com"],
        plaintext: "Draft 1",
      });
      await db.createDraft({
        threadId: thread.id,
        to: ["charlie@example.com"],
        plaintext: "Draft 2",
      });

      const drafts = await db.listDraftsByThread(thread.id);
      expect(drafts.length).toBe(2);
    });

    test("deleteDraft removes draft", async () => {
      const thread = await db.createThread({
        groupId: "group_delete",
        participants: ["alice@example.com"],
      });

      const draft = await db.createDraft({
        threadId: thread.id,
        to: ["bob@example.com"],
        plaintext: "Content",
      });

      await db.deleteDraft(draft.id);

      const deleted = await db.getDraft(draft.id);
      expect(deleted).toBeUndefined();
    });
  });

  describe("Sessions", () => {
    test("createSession stores session", async () => {
      const now = Date.now();
      const session = await db.createSession({
        id: "token_123",
        address: "alice@example.com",
        deviceId: "device_1",
        expiresAt: new Date(now + 86400000), // 24 hours
      });

      expect(session.id).toBe("token_123");
      expect(session.address).toBe("alice@example.com");
    });

    test("getSession retrieves session", async () => {
      const now = Date.now();
      await db.createSession({
        id: "token_456",
        address: "alice@example.com",
        deviceId: "device_1",
        expiresAt: new Date(now + 86400000),
      });

      const session = await db.getSession("token_456");
      expect(session?.id).toBe("token_456");
    });

    test("updateSessionActivity updates lastActivityAt", async () => {
      const now = Date.now();
      const session = await db.createSession({
        id: "token_activity",
        address: "alice@example.com",
        deviceId: "device_1",
        expiresAt: new Date(now + 86400000),
      });

      const oldActivity = session.lastActivityAt;

      // Small delay to ensure time difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      await db.updateSessionActivity("token_activity");

      const updated = await db.getSession("token_activity");
      expect(updated?.lastActivityAt.getTime()).toBeGreaterThan(
        oldActivity.getTime(),
      );
    });

    test("expireSessions removes expired sessions", async () => {
      const past = new Date(Date.now() - 86400000); // 24 hours ago
      const future = new Date(Date.now() + 86400000); // 24 hours from now

      await db.createSession({
        id: "token_expired",
        address: "alice@example.com",
        deviceId: "device_1",
        expiresAt: past,
      });

      await db.createSession({
        id: "token_active",
        address: "bob@example.com",
        deviceId: "device_2",
        expiresAt: future,
      });

      const count = await db.expireSessions();

      expect(count).toBe(1);
      expect(await db.getSession("token_expired")).toBeUndefined();
      expect(await db.getSession("token_active")).toBeDefined();
    });
  });
});
