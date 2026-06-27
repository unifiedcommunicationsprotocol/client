/**
 * Round-trip test: Key generation → Transport → Handshake
 */

import { describe, expect, it } from "bun:test";
import {
  generateSigningKey,
  signMessage,
  verifySignature,
} from "@/lib/crypto/signing";
import { testHandshake } from "@/lib/mockServer";

describe("Crypto Round-trip", () => {
  it("generates signing key successfully", async () => {
    const key = await generateSigningKey();

    expect(key).toBeDefined();
    expect(key.publicKey).toHaveLength(44); // Base64 encoded Ed25519 public key
    expect(key.secretKey).toHaveLength(88); // Base64 encoded Ed25519 secret key
    expect(key.createdAt).toBeGreaterThan(0);
    expect(key.expiresAt).toBeGreaterThan(key.createdAt);
    expect(key.revoked).toBe(false);
  });

  it("signs and verifies messages", async () => {
    const key = await generateSigningKey();
    const message = { user: "alice@example.com", text: "hello" };

    const signature = await signMessage(message, key.secretKey);
    expect(signature).toBeDefined();
    expect(signature.length).toBeGreaterThan(0);

    const isValid = await verifySignature(message, signature, key.publicKey);
    expect(isValid).toBe(true);

    // Verify invalid signature is rejected
    const wrongMsg = { user: "alice@example.com", text: "goodbye" };
    const isInvalid = await verifySignature(wrongMsg, signature, key.publicKey);
    expect(isInvalid).toBe(false);
  });

  it("uses canonical JSON for signing", async () => {
    const key = await generateSigningKey();

    // Messages with same content but different key order should produce same signature
    const msg1 = { a: 1, b: 2 };
    const msg2 = { b: 2, a: 1 };

    const sig1 = await signMessage(msg1, key.secretKey);
    const sig2 = await signMessage(msg2, key.secretKey);

    expect(sig1).toBe(sig2); // Same canonical JSON = same signature
  });
});

describe("Server Handshake", () => {
  it("completes UCPHello/UCPHelloAck exchange", async () => {
    const result = await testHandshake();

    expect(result.success).toBe(true);
    expect(result.challenge).toBeDefined();
    expect(result.serverId).toBe("mock-server-001");
    expect(result.challenge.length).toBeGreaterThan(0);
  });
});

describe("Full Round-trip", () => {
  it("generates key → signs message → verifies with cached identity", async () => {
    // 1. Generate signing key (onboarding Step 1)
    const signingKey = await generateSigningKey();
    expect(signingKey.publicKey).toBeDefined();

    // 2. Create message
    const message = {
      type: "message",
      text: "Hello UCP!",
      timestamp: Date.now(),
    };

    // 3. Sign message
    const signature = await signMessage(message, signingKey.secretKey);
    expect(signature).toBeDefined();

    // 4. Server receives & verifies (with public key)
    const isValid = await verifySignature(
      message,
      signature,
      signingKey.publicKey,
    );
    expect(isValid).toBe(true);

    // 5. Complete server handshake
    const handshake = await testHandshake();
    expect(handshake.success).toBe(true);
    expect(handshake.challenge).toBeDefined();
  });
});
