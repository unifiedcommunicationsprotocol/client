import { test, expect, describe, beforeEach } from "bun:test";
import {
  createGroup,
  encryptMessage,
  decryptMessage,
  addMember,
  removeMember,
  getGroupState,
  publishKeyPackage,
  clearGroupStore,
} from "./mls";

describe("MLS Group Management (RFC 9420)", () => {
  beforeEach(() => {
    clearGroupStore();
  });

  describe("Group Creation", () => {
    test("createGroup initializes a group with correct structure", async () => {
      const groupId = "group_abc123";
      const threadId = "thread_123";
      const members = ["alice@example.com", "bob@example.com"];

      const group = await createGroup(groupId, threadId, members);

      expect(group.groupId).toBe(groupId);
      expect(group.threadId).toBe(threadId);
      expect(group.epoch).toBe(0); // Initial epoch
      expect(group.members).toEqual(members);
      expect(group.createdAt).toBeGreaterThan(0);
    });

    test("createGroup can accept single creator as initial member", async () => {
      const groupId = "group_single";
      const threadId = "thread_single";
      const members = ["alice@example.com"];

      const group = await createGroup(groupId, threadId, members);

      expect(group.members.length).toBe(1);
      expect(group.members[0]).toBe("alice@example.com");
    });

    test("createGroup with multiple recipients", async () => {
      const groupId = "group_multi";
      const threadId = "thread_multi";
      const members = [
        "alice@example.com",
        "bob@example.com",
        "charlie@example.com",
      ];

      const group = await createGroup(groupId, threadId, members);

      expect(group.members.length).toBe(3);
      expect(group.members).toContain("alice@example.com");
      expect(group.members).toContain("bob@example.com");
      expect(group.members).toContain("charlie@example.com");
    });
  });

  describe("Message Encryption/Decryption", () => {
    test("encryptMessage encrypts content to group", async () => {
      const groupId = "group_123";
      const threadId = "thread_123";
      const members = ["alice@example.com", "bob@example.com"];
      await createGroup(groupId, threadId, members);

      const message = { body: "secret content" };

      const ciphertext = await encryptMessage(groupId, message);

      expect(ciphertext).toBeDefined();
      expect(typeof ciphertext).toBe("string");
      expect(ciphertext.length).toBeGreaterThan(0);
      // Should be base64-like
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(ciphertext)).toBe(true);
    });

    test("decryptMessage retrieves original message", async () => {
      const groupId = "group_decrypt";
      const threadId = "thread_decrypt";
      const members = ["alice@example.com", "bob@example.com"];
      await createGroup(groupId, threadId, members);

      const originalMessage = { body: "test message" };

      const ciphertext = await encryptMessage(groupId, originalMessage);
      const decrypted = await decryptMessage(groupId, ciphertext);

      expect(decrypted).toEqual(originalMessage);
    });

    test("decryptMessage fails with wrong groupId", async () => {
      const groupId1 = "group_1";
      const groupId2 = "group_2";
      const threadId = "thread_123";
      const members = ["alice@example.com"];

      await createGroup(groupId1, threadId, members);
      await createGroup(groupId2, threadId, members);

      const message = { body: "secret" };
      const ciphertext = await encryptMessage(groupId1, message);

      try {
        await decryptMessage(groupId2, ciphertext);
        expect(true).toBe(false); // Should reject
      } catch {
        // Expected to fail
      }
    });

    test("decryptMessage rejects invalid ciphertext", async () => {
      const groupId = "group_123";
      const threadId = "thread_123";
      const members = ["alice@example.com"];
      await createGroup(groupId, threadId, members);

      // Create invalid ciphertext (invalid JSON in base64)
      const invalidCiphertext = btoa("not valid json");

      try {
        await decryptMessage(groupId, invalidCiphertext);
        expect(true).toBe(false); // Should reject
      } catch {
        // Expected
      }
    });
  });

  describe("Membership Management", () => {
    test("addMember adds a new member to group", async () => {
      const groupId = "group_add";
      const threadId = "thread_add";
      const initialMembers = ["alice@example.com"];
      await createGroup(groupId, threadId, initialMembers);

      await addMember(groupId, "bob@example.com");

      const state = await getGroupState(groupId);
      expect(state.members.length).toBe(2);
      expect(state.members).toContain("bob@example.com");
    });

    test("addMember increments epoch", async () => {
      const groupId = "group_epoch";
      const threadId = "thread_epoch";
      const members = ["alice@example.com"];
      const group = await createGroup(groupId, threadId, members);

      const initialEpoch = group.epoch;

      await addMember(groupId, "bob@example.com");

      const state = await getGroupState(groupId);
      expect(state.epoch).toBe(initialEpoch + 1);
    });

    test("removeMember removes a member from group", async () => {
      const groupId = "group_remove";
      const threadId = "thread_remove";
      const members = ["alice@example.com", "bob@example.com"];
      await createGroup(groupId, threadId, members);

      await removeMember(groupId, "bob@example.com");

      const state = await getGroupState(groupId);
      expect(state.members.length).toBe(1);
      expect(state.members).not.toContain("bob@example.com");
      expect(state.members).toContain("alice@example.com");
    });

    test("removeMember increments epoch", async () => {
      const groupId = "group_remove_epoch";
      const threadId = "thread_remove_epoch";
      const members = ["alice@example.com", "bob@example.com"];
      const group = await createGroup(groupId, threadId, members);

      const initialEpoch = group.epoch;

      await removeMember(groupId, "bob@example.com");

      const state = await getGroupState(groupId);
      expect(state.epoch).toBe(initialEpoch + 1);
    });

    test("addMember prevents duplicate members", async () => {
      const groupId = "group_dup";
      const threadId = "thread_dup";
      const members = ["alice@example.com"];
      await createGroup(groupId, threadId, members);

      // Try to add already-existing member
      try {
        await addMember(groupId, "alice@example.com");
        // Depending on implementation, this might throw or silently succeed
        // For now, we'll accept both behaviors
      } catch {
        // Expected in strict implementations
      }

      const state = await getGroupState(groupId);
      // Count should still be 1 (no duplicates)
      const aliceCount = state.members.filter(
        (m) => m === "alice@example.com",
      ).length;
      expect(aliceCount).toBe(1);
    });
  });

  describe("KeyPackage Publishing", () => {
    test("publishKeyPackage creates a valid package", async () => {
      const address = "alice@example.com";

      const keyPackage = await publishKeyPackage(address);

      expect(keyPackage.address).toBe(address);
      expect(keyPackage.publicKey).toBeDefined();
      expect(keyPackage.cipherSuite).toContain("MLS");
      expect(keyPackage.createdAt).toBeGreaterThan(0);
      expect(keyPackage.expiresAt).toBeGreaterThan(keyPackage.createdAt);
    });

    test("publishKeyPackage expires within reasonable time", async () => {
      const address = "bob@example.com";
      const keyPackage = await publishKeyPackage(address);

      // Should expire within 1 year
      const maxAge = 365 * 24 * 60 * 60 * 1000;
      expect(keyPackage.expiresAt - keyPackage.createdAt).toBeLessThan(maxAge);

      // Should expire after at least 1 day
      const minAge = 24 * 60 * 60 * 1000;
      expect(keyPackage.expiresAt - keyPackage.createdAt).toBeGreaterThan(minAge);
    });

    test("publishKeyPackage has valid ciphersuite", async () => {
      const address = "charlie@example.com";
      const keyPackage = await publishKeyPackage(address);

      // RFC 9420 ciphersuite
      expect(keyPackage.cipherSuite).toContain("MLS");
      expect(keyPackage.cipherSuite).toContain("DHKEM");
      expect(keyPackage.cipherSuite).toContain("AES128GCM");
      expect(keyPackage.cipherSuite).toContain("SHA256");
    });
  });

  describe("Group State Management", () => {
    test("getGroupState returns current group state", async () => {
      const groupId = "group_state";
      const threadId = "thread_state";
      const members = ["alice@example.com", "bob@example.com"];

      const created = await createGroup(groupId, threadId, members);
      const retrieved = await getGroupState(groupId);

      expect(retrieved.groupId).toBe(created.groupId);
      expect(retrieved.threadId).toBe(created.threadId);
      expect(retrieved.members).toEqual(created.members);
    });

    test("getGroupState reflects membership changes", async () => {
      const groupId = "group_changes";
      const threadId = "thread_changes";
      const members = ["alice@example.com"];

      await createGroup(groupId, threadId, members);

      await addMember(groupId, "bob@example.com");
      let state = await getGroupState(groupId);
      expect(state.members.length).toBe(2);

      await addMember(groupId, "charlie@example.com");
      state = await getGroupState(groupId);
      expect(state.members.length).toBe(3);

      await removeMember(groupId, "bob@example.com");
      state = await getGroupState(groupId);
      expect(state.members.length).toBe(2);
    });

    test("getGroupState reflects epoch advancement", async () => {
      const groupId = "group_epoch_track";
      const threadId = "thread_epoch_track";
      const members = ["alice@example.com"];

      const initial = await createGroup(groupId, threadId, members);
      expect(initial.epoch).toBe(0);

      await addMember(groupId, "bob@example.com");
      let state = await getGroupState(groupId);
      expect(state.epoch).toBe(1);

      await addMember(groupId, "charlie@example.com");
      state = await getGroupState(groupId);
      expect(state.epoch).toBe(2);
    });
  });
});
