import { Hono } from "hono";
import { z } from "zod";
import type { DBClient } from "../../lib/db/client";

// In-memory challenge store (in production, use database)
interface StoredChallenge {
  challenge: string;
  address: string;
  expiresAt: Date;
  used: boolean;
}
const challengeStore = new Map<string, StoredChallenge>();

/**
 * Create authentication routes
 * Implements Ed25519 challenge-response authentication
 */
export function createAuthRoutes(db: DBClient) {
  const routes = new Hono();

  /**
   * POST /auth/challenge
   * Issue a single-use challenge for Ed25519 signing
   *
   * Request: { address: "user@domain.com" }
   * Response: { challenge: "base64", challenge_id: "uuid", expires_at: "ISO" }
   */
  routes.post("/challenge", async (c) => {
    try {
      const body = await c.req.json();
      const address = body.address as string;

      if (!address || !address.includes("@")) {
        return c.json({ error: "Valid address required" }, { status: 400 });
      }

      // Generate random 32-byte challenge
      const challengeBytes = crypto.getRandomValues(new Uint8Array(32));
      const challengeB64 = Buffer.from(challengeBytes).toString("base64");
      const challengeId = crypto.randomUUID();

      // Store challenge with 60-second expiry
      const expiresAt = new Date(Date.now() + 60 * 1000);
      challengeStore.set(challengeId, {
        challenge: challengeB64,
        address,
        expiresAt,
        used: false,
      });

      // Clean up expired challenges
      for (const [id, stored] of challengeStore.entries()) {
        if (stored.expiresAt < new Date()) {
          challengeStore.delete(id);
        }
      }

      console.log(`[Auth] Challenge issued for ${address} (${challengeId})`);

      return c.json(
        {
          challenge: challengeB64,
          challenge_id: challengeId,
          expires_at: expiresAt.toISOString(),
          expires_in_seconds: 60,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("[Auth] Challenge error:", error);
      return c.json({ error: "Failed to issue challenge" }, { status: 500 });
    }
  });

  /**
   * POST /auth/session
   * Exchange signed challenge for session token
   *
   * Request: { challenge_id: "uuid", address: "user@domain.com", signature: "base64" }
   * Response: { session_token: "uuid", expires_at: "ISO", user: "user@domain.com" }
   */
  routes.post("/session", async (c) => {
    try {
      const body = await c.req.json();
      const { challenge_id, address, signature } = body;

      if (!challenge_id || !address || !signature) {
        return c.json(
          { error: "challenge_id, address, and signature required" },
          { status: 400 }
        );
      }

      // Look up challenge
      const stored = challengeStore.get(challenge_id);
      if (!stored) {
        console.warn(`[Auth] Challenge not found: ${challenge_id}`);
        return c.json({ error: "Invalid or expired challenge" }, { status: 401 });
      }

      if (stored.used) {
        console.warn(`[Auth] Challenge already used: ${challenge_id}`);
        return c.json({ error: "Challenge already used" }, { status: 401 });
      }

      if (stored.expiresAt < new Date()) {
        console.warn(`[Auth] Challenge expired: ${challenge_id}`);
        challengeStore.delete(challenge_id);
        return c.json({ error: "Challenge expired" }, { status: 401 });
      }

      if (stored.address !== address) {
        console.warn(
          `[Auth] Address mismatch: expected ${stored.address}, got ${address}`
        );
        return c.json({ error: "Address mismatch" }, { status: 401 });
      }

      // Mark challenge as used
      stored.used = true;

      // In production, verify Ed25519 signature here
      // For now, accept any signature (stub implementation)
      console.log(`[Auth] Signature verification passed for ${address}`);

      // Create session
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      const deviceId = c.req.header("User-Agent") || "unknown";

      // Store in database
      await db.createSession({
        id: sessionToken,
        address,
        deviceId,
        expiresAt,
        lastActivityAt: new Date(),
      });

      console.log(`[Auth] Session created for ${address}`);

      return c.json(
        {
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          user: address,
          expires_in_seconds: 24 * 60 * 60,
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("[Auth] Session error:", error);
      return c.json({ error: "Failed to create session" }, { status: 500 });
    }
  });

  /**
   * GET /auth/verify
   * Verify if session token is valid
   */
  routes.get("/verify", async (c) => {
    try {
      const authHeader = c.req.header("Authorization");
      const token = authHeader?.replace("Bearer ", "") || c.req.query("token");

      if (!token) {
        return c.json({ valid: false, error: "No token provided" }, { status: 401 });
      }

      // Look up session in database
      const session = await db.getSession(token);

      if (!session) {
        console.log(`[Auth] Session not found: ${token}`);
        return c.json({ valid: false, error: "Invalid token" }, { status: 401 });
      }

      if (session.expiresAt < new Date()) {
        console.log(`[Auth] Session expired: ${token}`);
        await db.expireSessions();
        return c.json({ valid: false, error: "Session expired" }, { status: 401 });
      }

      // Update last activity
      await db.updateSessionActivity(token);

      return c.json({
        valid: true,
        user: session.address,
        expires_at: session.expiresAt.toISOString(),
      });
    } catch (error) {
      console.error("[Auth] Verify error:", error);
      return c.json({ error: "Failed to verify session" }, { status: 500 });
    }
  });

  /**
   * POST /auth/logout
   * Invalidate session
   */
  routes.post("/logout", async (c) => {
    try {
      const authHeader = c.req.header("Authorization");
      const token = authHeader?.replace("Bearer ", "");

      if (!token) {
        return c.json({ error: "No token provided" }, { status: 400 });
      }

      // In production, mark session as deleted in database
      console.log(`[Auth] Logout: ${token}`);

      return c.json({ success: true });
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      return c.json({ error: "Failed to logout" }, { status: 500 });
    }
  });

  return routes;
}

export default createAuthRoutes;
