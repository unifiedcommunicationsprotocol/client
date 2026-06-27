/**
 * UCP Client WebSocket Transport Layer (Functional)
 * Handles connection, authentication, keepalive, and reconnection
 */

export interface TransportConfig {
  serverUrl: string;
  authToken: string;
  clientId: string;
  serverSigningKey?: string;
}

export interface TransportCallbacks {
  onOpen?: () => void;
  onMessage?: (msg: unknown) => void;
  onError?: (err: Error) => void;
  onClose?: () => void;
  onReconnect?: (attempt: number) => void;
}

interface UCPHello {
  version: string;
  auth_token: string;
  capabilities: string[];
}

interface UCPHelloAck {
  version: string;
  server_id: string;
  challenge: string;
  server_sig?: string;
}

interface TransportState {
  ws: WebSocket | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  reconnectAttempt: number;
  reconnectTimeout: ReturnType<typeof setTimeout> | null;
  keepaliveInterval: ReturnType<typeof setInterval> | null;
  challengeExpiry: number | null;
  currentChallenge: string | null;
}

/**
 * Create a new transport instance (closure-based factory)
 */
export const createTransport = (
  config: TransportConfig,
  callbacks: TransportCallbacks = {},
) => {
  let state: TransportState = {
    ws: null,
    isConnecting: false,
    isAuthenticated: false,
    reconnectAttempt: 0,
    reconnectTimeout: null,
    keepaliveInterval: null,
    challengeExpiry: null,
    currentChallenge: null,
  };

  const updateState = (updates: Partial<TransportState>) => {
    state = { ...state, ...updates };
  };

  const performHandshake = async (): Promise<void> => {
    const ws = state.ws;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not ready");
    }

    const hello: UCPHello = {
      version: "1.0",
      auth_token: config.authToken,
      capabilities: ["mls", "e2e_signing", "receipt_tracking"],
    };

    ws.send(JSON.stringify({ type: "ucp_hello", ...hello }));

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("UCPHelloAck timeout"));
      }, 5000);

      const originalOnMessage = ws.onmessage;
      ws.onmessage = (event) => {
        clearTimeout(timeout);

        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "ucp_hello_ack") {
            const ack = msg as UCPHelloAck;
            const now = Date.now();
            updateState({
              currentChallenge: ack.challenge,
              challengeExpiry: now + 60000,
              isAuthenticated: true,
            });
            ws.onmessage = originalOnMessage;
            resolve();
          } else {
            ws.onmessage = originalOnMessage;
            handleMessage(event.data);
          }
        } catch (err) {
          ws.onmessage = originalOnMessage;
          reject(err);
        }
      };
    });
  };

  const startKeepalive = () => {
    const interval = setInterval(() => {
      if (state.ws?.readyState === WebSocket.OPEN) {
        state.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
    updateState({ keepaliveInterval: interval });
  };

  const stopKeepalive = () => {
    if (state.keepaliveInterval !== null) {
      clearInterval(state.keepaliveInterval);
      updateState({ keepaliveInterval: null });
    }
  };

  const attemptReconnect = () => {
    const baseDelay = Math.min(2 ** state.reconnectAttempt * 1000, 60000);
    const jitter = (Math.random() - 0.5) * 0.4 * baseDelay;
    const delay = Math.max(1000, baseDelay + jitter);

    const timeout = setTimeout(() => {
      updateState({ reconnectAttempt: state.reconnectAttempt + 1 });
      callbacks.onReconnect?.(state.reconnectAttempt);

      connect().catch((err) => {
        console.error(
          `Reconnection attempt ${state.reconnectAttempt} failed:`,
          err,
        );
      });
    }, delay);

    updateState({ reconnectTimeout: timeout });
  };

  const handleMessage = (data: string) => {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "ping") {
        state.ws?.send(JSON.stringify({ type: "pong" }));
        return;
      }

      callbacks.onMessage?.(msg);
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  };

  const connect = async (): Promise<void> => {
    if (state.isConnecting) return;
    if (state.ws?.readyState === WebSocket.OPEN) return;

    updateState({ isConnecting: true });

    return new Promise((resolve, reject) => {
      try {
        const ws = new WebSocket(config.serverUrl);
        updateState({ ws });

        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
          ws.close();
        }, 10000);

        ws.onopen = async () => {
          clearTimeout(timeout);
          try {
            await performHandshake();
            updateState({ reconnectAttempt: 0 });
            startKeepalive();
            callbacks.onOpen?.();
            resolve();
          } catch (err) {
            reject(err);
          }
        };

        ws.onerror = (event) => {
          clearTimeout(timeout);
          const error = new Error(`WebSocket error: ${event}`);
          callbacks.onError?.(error);
          reject(error);
        };

        ws.onmessage = (event) => {
          handleMessage(event.data);
        };

        ws.onclose = () => {
          updateState({ isAuthenticated: false });
          stopKeepalive();
          callbacks.onClose?.();
          updateState({ isConnecting: false });
          attemptReconnect();
        };
      } catch (err) {
        updateState({ isConnecting: false });
        reject(err);
      }
    });
  };

  const send = (msg: unknown): void => {
    if (!state.ws || state.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    if (!state.isAuthenticated) {
      throw new Error("Not authenticated");
    }

    state.ws.send(JSON.stringify(msg));
  };

  const disconnect = (): void => {
    updateState({ isConnecting: false, isAuthenticated: false });
    stopKeepalive();

    if (state.reconnectTimeout !== null) {
      clearTimeout(state.reconnectTimeout);
      updateState({ reconnectTimeout: null });
    }

    if (state.ws) {
      state.ws.close();
      updateState({ ws: null });
    }
  };

  const isReady = (): boolean =>
    state.isAuthenticated && state.ws?.readyState === WebSocket.OPEN;

  const getChallenge = (): string | null => {
    if (state.challengeExpiry && Date.now() > state.challengeExpiry) {
      updateState({ currentChallenge: null, challengeExpiry: null });
    }
    return state.currentChallenge;
  };

  const getState = () => ({ ...state });

  return {
    connect,
    send,
    disconnect,
    isReady,
    getChallenge,
    getState,
  };
};

export type Transport = ReturnType<typeof createTransport>;
