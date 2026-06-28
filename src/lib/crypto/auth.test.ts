import { test, expect, describe } from "bun:test";
import {
  createChallengeResponse,
  verifyChallengeResponse,
  createAuthToken,
} from "./auth";
import { generateKeyPair } from "./signing";

describe("Challenge-Response Authentication", () => {
  describe("Challenge Response Creation", () => {
    test("createChallengeResponse signs a challenge", async () => {
      const keyPair = await generateKeyPair();
      const challenge = "abc123def456"; // 32-byte base64 challenge

      const response = await createChallengeResponse(
        challenge,
        keyPair.secretKey,
      );

      expect(response.challenge).toBe(challenge);
      expect(response.signature).toBeDefined();
      expect(response.signature.length).toBeGreaterThan(0);
    });

    test("createChallengeResponse uses canonical JSON", async () => {
      const keyPair = await generateKeyPair();
      const challenge = "test_challenge";

      const response1 = await createChallengeResponse(
        challenge,
        keyPair.secretKey,
      );
      const response2 = await createChallengeResponse(
        challenge,
        keyPair.secretKey,
      );

      // Same challenge + key should produce same signature
      expect(response1.signature).toBe(response2.signature);
    });

    test("different challenges produce different signatures", async () => {
      const keyPair = await generateKeyPair();

      const response1 = await createChallengeResponse(
        "challenge1",
        keyPair.secretKey,
      );
      const response2 = await createChallengeResponse(
        "challenge2",
        keyPair.secretKey,
      );

      expect(response1.signature).not.toBe(response2.signature);
    });

    test("different keys produce different signatures", async () => {
      const keyPair1 = await generateKeyPair();
      const keyPair2 = await generateKeyPair();
      const challenge = "test_challenge";

      const response1 = await createChallengeResponse(
        challenge,
        keyPair1.secretKey,
      );
      const response2 = await createChallengeResponse(
        challenge,
        keyPair2.secretKey,
      );

      expect(response1.signature).not.toBe(response2.signature);
    });
  });

  describe("Challenge Response Verification", () => {
    test("verifyChallengeResponse accepts valid response", async () => {
      const keyPair = await generateKeyPair();
      const challenge = "test_challenge";

      const response = await createChallengeResponse(
        challenge,
        keyPair.secretKey,
      );
      const verified = await verifyChallengeResponse(
        response.challenge,
        response.signature,
        keyPair.publicKey,
      );

      expect(verified).toBe(true);
    });

    test("verifyChallengeResponse rejects modified challenge", async () => {
      const keyPair = await generateKeyPair();
      const challenge = "test_challenge";

      const response = await createChallengeResponse(
        challenge,
        keyPair.secretKey,
      );

      // Try to verify with different challenge
      const verified = await verifyChallengeResponse(
        "modified_challenge",
        response.signature,
        keyPair.publicKey,
      );

      expect(verified).toBe(false);
    });

    test("verifyChallengeResponse rejects invalid signature", async () => {
      const keyPair = await generateKeyPair();
      const challenge = "test_challenge";

      const verified = await verifyChallengeResponse(
        challenge,
        "invalid_signature",
        keyPair.publicKey,
      );

      expect(verified).toBe(false);
    });

    test("verifyChallengeResponse rejects signature from wrong key", async () => {
      const keyPair1 = await generateKeyPair();
      const keyPair2 = await generateKeyPair();
      const challenge = "test_challenge";

      const response = await createChallengeResponse(
        challenge,
        keyPair1.secretKey,
      );

      // Try to verify with different key
      const verified = await verifyChallengeResponse(
        challenge,
        response.signature,
        keyPair2.publicKey,
      );

      expect(verified).toBe(false);
    });
  });

  describe("Auth Token Creation", () => {
    test("createAuthToken generates a token", () => {
      const token = createAuthToken("user@example.com");

      expect(token).toBeDefined();
      expect(token.length).toBeGreaterThan(0);
    });

    test("createAuthToken is deterministic (same input → same token)", () => {
      const token1 = createAuthToken("user@example.com");
      const token2 = createAuthToken("user@example.com");

      expect(token1).toBe(token2);
    });

    test("createAuthToken differs for different addresses", () => {
      const token1 = createAuthToken("alice@example.com");
      const token2 = createAuthToken("bob@example.com");

      expect(token1).not.toBe(token2);
    });

    test("createAuthToken produces base64-safe string", () => {
      const token = createAuthToken("user@example.com");

      // Base64 pattern: alphanumeric, +, /, =
      expect(/^[A-Za-z0-9+/]*={0,2}$/.test(token)).toBe(true);
    });
  });

  describe("Integration: Challenge → Auth Flow", () => {
    test("full auth flow: challenge → sign → verify → token", async () => {
      const keyPair = await generateKeyPair();
      const address = "alice@example.com";
      const challenge = "server_challenge_token";

      // Client receives challenge from server, signs it
      const challengeResponse = await createChallengeResponse(
        challenge,
        keyPair.secretKey,
      );

      // Server verifies the signed challenge
      const verified = await verifyChallengeResponse(
        challengeResponse.challenge,
        challengeResponse.signature,
        keyPair.publicKey,
      );
      expect(verified).toBe(true);

      // Server creates auth token for client
      const authToken = createAuthToken(address);
      expect(authToken).toBeDefined();
      expect(authToken.length).toBeGreaterThan(0);
    });

    test("multiple clients can authenticate independently", async () => {
      const client1Key = await generateKeyPair();
      const client2Key = await generateKeyPair();
      const challenge = "server_challenge";

      // Each client signs with their own key
      const resp1 = await createChallengeResponse(
        challenge,
        client1Key.secretKey,
      );
      const resp2 = await createChallengeResponse(
        challenge,
        client2Key.secretKey,
      );

      // Both should verify with their respective keys
      const verified1 = await verifyChallengeResponse(
        challenge,
        resp1.signature,
        client1Key.publicKey,
      );
      const verified2 = await verifyChallengeResponse(
        challenge,
        resp2.signature,
        client2Key.publicKey,
      );

      expect(verified1).toBe(true);
      expect(verified2).toBe(true);

      // Cross-verification should fail
      const crossVerified1 = await verifyChallengeResponse(
        challenge,
        resp1.signature,
        client2Key.publicKey,
      );
      expect(crossVerified1).toBe(false);
    });
  });
});
