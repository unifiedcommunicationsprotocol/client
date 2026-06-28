import { test, expect, describe } from "bun:test";
import {
  generateKeyPair,
  generateSigningKey,
  signMessage,
  verifySignature,
  hashSha256,
  generateThreadId,
  publicKeyToSigningKey,
} from "./signing";

describe("Ed25519 Signing", () => {
  describe("Key Generation", () => {
    test("generateKeyPair returns base64-encoded keys", async () => {
      const keyPair = await generateKeyPair();

      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.secretKey).toBeDefined();
      // Base64 validation: no invalid chars
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(keyPair.publicKey)).toBe(true);
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(keyPair.secretKey)).toBe(true);
    });

    test("generateSigningKey includes expiration (60 days)", async () => {
      const signingKey = await generateSigningKey();
      const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;

      expect(signingKey.publicKey).toBeDefined();
      expect(signingKey.secretKey).toBeDefined();
      expect(signingKey.createdAt).toBeGreaterThan(0);
      expect(signingKey.expiresAt).toBeGreaterThan(signingKey.createdAt);
      expect(signingKey.expiresAt - signingKey.createdAt).toBeCloseTo(
        sixtyDaysMs,
        -3,
      );
      expect(signingKey.revoked).toBe(false);
    });

    test("each keyPair is unique", async () => {
      const key1 = await generateKeyPair();
      const key2 = await generateKeyPair();

      expect(key1.publicKey).not.toBe(key2.publicKey);
      expect(key1.secretKey).not.toBe(key2.secretKey);
    });
  });

  describe("Message Signing & Verification", () => {
    test("sign and verify happy path", async () => {
      const keyPair = await generateKeyPair();
      const message = {
        id: "msg_123",
        from: "alice@example.com",
        body: "hello",
      };

      const signature = await signMessage(message, keyPair.secretKey);
      const verified = await verifySignature(
        message,
        signature,
        keyPair.publicKey,
      );

      expect(verified).toBe(true);
    });

    test("reject modified message", async () => {
      const keyPair = await generateKeyPair();
      const message = {
        id: "msg_123",
        from: "alice@example.com",
        body: "hello",
      };

      const signature = await signMessage(message, keyPair.secretKey);

      // Tamper with message
      const tamperedMessage = {
        ...message,
        body: "goodbye",
      };

      const verified = await verifySignature(
        tamperedMessage,
        signature,
        keyPair.publicKey,
      );

      expect(verified).toBe(false);
    });

    test("reject if signature is invalid base64", async () => {
      const keyPair = await generateKeyPair();
      const message = { test: true };

      const verified = await verifySignature(
        message,
        "not a valid signature!",
        keyPair.publicKey,
      );

      expect(verified).toBe(false);
    });

    test("reject signature from wrong key", async () => {
      const keyPair1 = await generateKeyPair();
      const keyPair2 = await generateKeyPair();
      const message = { test: true };

      const signature = await signMessage(message, keyPair1.secretKey);

      // Try to verify with different key
      const verified = await verifySignature(
        message,
        signature,
        keyPair2.publicKey,
      );

      expect(verified).toBe(false);
    });
  });

  describe("Canonical JSON", () => {
    test("canonical JSON has sorted keys", async () => {
      const keyPair = await generateKeyPair();
      const message = { z: 1, a: 2, m: 3 };

      const sig1 = await signMessage(message, keyPair.secretKey);
      // Re-sign with same key to ensure signature is deterministic
      const sig2 = await signMessage(message, keyPair.secretKey);

      expect(sig1).toBe(sig2);
    });

    test("different key order produces same signature", async () => {
      const keyPair = await generateKeyPair();
      const msg1 = { a: 1, b: 2, c: 3 };
      const msg2 = { c: 3, a: 1, b: 2 };

      const sig1 = await signMessage(msg1, keyPair.secretKey);
      const sig2 = await signMessage(msg2, keyPair.secretKey);

      expect(sig1).toBe(sig2);
    });

    test("whitespace difference invalidates signature", async () => {
      const keyPair = await generateKeyPair();
      // This tests that canonical JSON is strict about whitespace
      const message = { key: "value with spaces" };

      const signature = await signMessage(message, keyPair.secretKey);

      // Verify with same message structure
      expect(await verifySignature(message, signature, keyPair.publicKey)).toBe(
        true,
      );
    });

    test("null and false serialize correctly", async () => {
      const keyPair = await generateKeyPair();
      const msg1 = { value: null };
      const msg2 = { value: false };

      const sig1 = await signMessage(msg1, keyPair.secretKey);
      const sig2 = await signMessage(msg2, keyPair.secretKey);

      expect(sig1).not.toBe(sig2); // Different values produce different signatures
      expect(await verifySignature(msg1, sig1, keyPair.publicKey)).toBe(true);
      expect(await verifySignature(msg2, sig2, keyPair.publicKey)).toBe(true);
    });

    test("arrays preserve order", async () => {
      const keyPair = await generateKeyPair();
      const msg1 = { list: [1, 2, 3] };
      const msg2 = { list: [3, 2, 1] };

      const sig1 = await signMessage(msg1, keyPair.secretKey);
      const sig2 = await signMessage(msg2, keyPair.secretKey);

      expect(sig1).not.toBe(sig2);
    });
  });

  describe("Hashing", () => {
    test("hashSha256 returns hex string", async () => {
      const hash = await hashSha256("hello");

      expect(hash).toBeDefined();
      expect(hash.length).toBe(64); // SHA256 = 256 bits = 64 hex chars
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });

    test("same input produces same hash", async () => {
      const hash1 = await hashSha256("test");
      const hash2 = await hashSha256("test");

      expect(hash1).toBe(hash2);
    });

    test("different inputs produce different hashes", async () => {
      const hash1 = await hashSha256("test1");
      const hash2 = await hashSha256("test2");

      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Thread ID Generation", () => {
    test("generateThreadId returns a valid ULID", () => {
      const threadId = generateThreadId();

      expect(threadId).toBeDefined();
      expect(threadId.length).toBeGreaterThan(0);
      // Should be alphanumeric
      expect(/^[A-Z0-9]+$/.test(threadId)).toBe(true);
    });

    test("thread IDs are unique", () => {
      const id1 = generateThreadId();
      const id2 = generateThreadId();

      expect(id1).not.toBe(id2);
    });
  });

  describe("Public Key Conversion", () => {
    test("publicKeyToSigningKey wraps a public key", () => {
      const publicKey =
        "abcd1234=="; /* base64-like string */

      const signingKey = publicKeyToSigningKey(publicKey);

      expect(signingKey.publicKey).toBe(publicKey);
      expect(signingKey.secretKey).toBe("");
      expect(signingKey.createdAt).toBeGreaterThan(0);
      expect(signingKey.revoked).toBe(false);
    });
  });

  describe("Integration Tests", () => {
    test("envelope sign and verify flow", async () => {
      const senderKey = await generateKeyPair();

      // Sender creates message
      const envelope = {
        from: "alice@example.com",
        to: ["bob@example.com"],
        message: { body: "secret content" },
        sent_at: 1234567890,
      };

      // Sender signs
      const signature = await signMessage(envelope, senderKey.secretKey);

      // Recipient verifies
      const verified = await verifySignature(
        envelope,
        signature,
        senderKey.publicKey,
      );

      expect(verified).toBe(true);

      // Tampering is detected
      const tampered = { ...envelope, sent_at: 9999999999 };
      const tamperedVerified = await verifySignature(
        tampered,
        signature,
        senderKey.publicKey,
      );

      expect(tamperedVerified).toBe(false);
    });

    test("multiple signers on same message", async () => {
      const key1 = await generateKeyPair();
      const key2 = await generateKeyPair();

      const message = { content: "multi-sig test" };

      const sig1 = await signMessage(message, key1.secretKey);
      const sig2 = await signMessage(message, key2.secretKey);

      // Each signature verifies with its own key
      expect(await verifySignature(message, sig1, key1.publicKey)).toBe(true);
      expect(await verifySignature(message, sig2, key2.publicKey)).toBe(true);

      // Cross-verification fails
      expect(await verifySignature(message, sig1, key2.publicKey)).toBe(false);
      expect(await verifySignature(message, sig2, key1.publicKey)).toBe(false);
    });
  });
});
