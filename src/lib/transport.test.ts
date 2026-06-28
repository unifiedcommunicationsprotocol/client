import { test, expect, describe } from "bun:test";
import { createTransport } from "./transport";

describe("WebSocket Transport", () => {
  describe("Factory", () => {
    test("createTransport returns transport object with required methods", () => {
      const transport = createTransport({
        serverUrl: "ws://localhost:8000",
        authToken: "token",
        clientId: "client1",
      });

      expect(typeof transport.connect).toBe("function");
      expect(typeof transport.send).toBe("function");
      expect(typeof transport.disconnect).toBe("function");
      expect(typeof transport.isReady).toBe("function");
      expect(typeof transport.getChallenge).toBe("function");
      expect(typeof transport.getState).toBe("function");
    });

    test("initial state is disconnected and unauthenticated", () => {
      const transport = createTransport({
        serverUrl: "ws://localhost:8000",
        authToken: "token",
        clientId: "client1",
      });

      const state = transport.getState();

      expect(state.isConnecting).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.reconnectAttempt).toBe(0);
      expect(state.ws).toBeNull();
    });
  });

  describe("Behavior Contracts", () => {
    test("send fails when not connected", () => {
      const transport = createTransport({
        serverUrl: "ws://localhost:8000",
        authToken: "token",
        clientId: "client1",
      });

      expect(() => {
        transport.send({ type: "test" });
      }).toThrow();
    });

    test("disconnect clears authentication state", () => {
      const transport = createTransport({
        serverUrl: "ws://localhost:8000",
        authToken: "token",
        clientId: "client1",
      });

      transport.disconnect();

      expect(transport.isReady()).toBe(false);
      const state = transport.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    test("isReady returns false when not authenticated", () => {
      const transport = createTransport({
        serverUrl: "ws://localhost:8000",
        authToken: "token",
        clientId: "client1",
      });

      expect(transport.isReady()).toBe(false);
    });

    test("getChallenge returns null when no challenge set", () => {
      const transport = createTransport({
        serverUrl: "ws://localhost:8000",
        authToken: "token",
        clientId: "client1",
      });

      const challenge = transport.getChallenge();
      expect(challenge).toBeNull();
    });
  });

  describe("Callback Registration", () => {
    test("accepts onOpen, onMessage, onError, onClose, onReconnect callbacks", () => {
      const callbacks = {
        onOpen: () => {},
        onMessage: () => {},
        onError: () => {},
        onClose: () => {},
        onReconnect: () => {},
      };

      const transport = createTransport(
        {
          serverUrl: "ws://localhost:8000",
          authToken: "token",
          clientId: "client1",
        },
        callbacks,
      );

      expect(transport).toBeDefined();
    });
  });
});
