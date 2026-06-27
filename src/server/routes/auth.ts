import { Hono } from "hono";

const authRoutes = new Hono();

// POST /api/auth/challenge - Issue a single-use challenge
authRoutes.post("/challenge", async (c) => {
  const challenge = crypto.getRandomValues(new Uint8Array(32));
  return c.json({
    challenge: Buffer.from(challenge).toString("base64"),
    expires_at: Date.now() + 60 * 1000, // 60 second expiry
  });
});

// POST /api/auth/session - Exchange signed challenge for session
authRoutes.post("/session", async (c) => {
  // TODO: Verify Ed25519 signature over challenge
  // For now, stub implementation
  const sessionToken = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // In production: store in database via sessions table
  // await db.insert(sessions).values({
  //   token: sessionToken,
  //   expires_at: expiresAt,
  // });

  return c.json({
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  });
});

// GET /api/auth/verify - Check if session is valid
authRoutes.get("/verify", async (c) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return c.json({ valid: false }, { status: 401 });
  }

  // TODO: Verify token in sessions table
  return c.json({ valid: true });
});

export default authRoutes;
