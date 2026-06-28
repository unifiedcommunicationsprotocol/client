/**
 * Mock UCP Server for testing (Functional)
 * Simulates WebSocket server with UCPHello/UCPHelloAck handshake
 */

export interface MockServerConfig {
  port?: number;
  serverId?: string;
}

/**
 * Generate a random 32-byte challenge (base64)
 */
const generateChallenge = (): string => {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for non-browser environments
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Buffer.from(bytes).toString("base64");
};

/**
 * Create a mock UCP server handler (for testing)
 * In production, this would be replaced with actual server
 */
export const createMockServerHandler = (config: MockServerConfig = {}) => {
  const serverId = config.serverId ?? "mock-server-001";
  const sessions = new Map<string, { challenge: string; createdAt: number }>();

  /**
   * Handle incoming message from client
   */
  const handleMessage = (
    messageData: string,
    clientId: string,
  ): { type: string; challenge?: string; server_id?: string } | null => {
    try {
      const msg = JSON.parse(messageData);

      if (msg.type === "ucp_hello") {
        const challenge = generateChallenge();
        const now = Date.now();

        // Store session
        sessions.set(clientId, { challenge, createdAt: now });

        return {
          type: "ucp_hello_ack",
          server_id: serverId,
          challenge,
        };
      }

      if (msg.type === "ping") {
        return { type: "pong" };
      }

      // Echo back for testing
      return msg;
    } catch (err) {
      console.error("Mock server error:", err);
      return null;
    }
  };

  /**
   * Get stored challenge for verification
   */
  const getChallenge = (clientId: string): string | null => {
    const session = sessions.get(clientId);
    if (!session) return null;

    // Challenges expire after 60 seconds
    if (Date.now() - session.createdAt > 60000) {
      sessions.delete(clientId);
      return null;
    }

    return session.challenge;
  };

  /**
   * Clear session (for testing)
   */
  const clearSession = (clientId: string) => {
    sessions.delete(clientId);
  };

  return {
    handleMessage,
    getChallenge,
    clearSession,
  };
};

export type MockServer = ReturnType<typeof createMockServerHandler>;

/**
 * Test helper: Simulate client ↔ server exchange
 */
export const testHandshake = async () => {
  const server = createMockServerHandler();
  const clientId = "test-client-001";

  // Client sends UCPHello
  const hello = JSON.stringify({
    type: "ucp_hello",
    version: "1.0",
    auth_token: "test-token-xyz",
    capabilities: ["mls", "e2e_signing"],
  });

  const ackMsg = server.handleMessage(hello, clientId);
  if (ackMsg?.type !== "ucp_hello_ack") {
    throw new Error("Expected ucp_hello_ack");
  }

  const challenge = server.getChallenge(clientId);
  if (!challenge || challenge !== ackMsg.challenge) {
    throw new Error("Challenge mismatch");
  }

  // Server can verify client's response to challenge
  // (In real implementation, client signs challenge with their key)
  return {
    success: true,
    challenge,
    serverId: ackMsg.server_id,
  };
};
