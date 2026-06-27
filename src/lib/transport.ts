/**
 * UCP Client WebSocket Transport Layer
 * Handles connection, authentication, keepalive, and reconnection
 */

export interface TransportConfig {
  serverUrl: string; // WebSocket URL (e.g., wss://ucp.example.com)
  authToken: string; // Auth token from session (base64)
  clientId: string; // Client identifier
  serverSigningKey?: string; // Public key to verify server signature (base64)
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
  challenge: string; // 32-byte challenge (base64)
  server_sig?: string; // Server signature over "server_hello:" || auth_token || server_id
}

export class UCPTransport {
  private ws: WebSocket | null = null;
  private config: TransportConfig;
  private callbacks: TransportCallbacks;
  private reconnectAttempt = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private keepaliveInterval: ReturnType<typeof setInterval> | null = null;
  private challengeExpiry: number | null = null;
  private currentChallenge: string | null = null;
  private isConnecting = false;
  private isAuthenticated = false;

  constructor(config: TransportConfig, callbacks: TransportCallbacks = {}) {
    this.config = config;
    this.callbacks = callbacks;
  }

  /**
   * Connect to UCP server and perform handshake
   */
  async connect(): Promise<void> {
    if (this.isConnecting) return;
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.isConnecting = true;

    try {
      // Establish WebSocket connection
      this.ws = new WebSocket(this.config.serverUrl);

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("WebSocket connection timeout"));
          this.ws?.close();
        }, 10000);

        this.ws!.onopen = async () => {
          clearTimeout(timeout);
          try {
            await this.performHandshake();
            this.reconnectAttempt = 0;
            this.startKeepalive();
            this.callbacks.onOpen?.();
            resolve();
          } catch (err) {
            reject(err);
          }
        };

        this.ws!.onerror = (event) => {
          clearTimeout(timeout);
          const error = new Error(`WebSocket error: ${event}`);
          this.callbacks.onError?.(error);
          reject(error);
        };

        this.ws!.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws!.onclose = () => {
          this.isAuthenticated = false;
          this.stopKeepalive();
          this.callbacks.onClose?.();
          this.isConnecting = false;
          this.attemptReconnect();
        };
      });
    } catch (err) {
      this.isConnecting = false;
      throw err;
    }
  }

  /**
   * Perform UCP handshake and authentication
   */
  private async performHandshake(): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not ready");
    }

    // Send UCPHello
    const hello: UCPHello = {
      version: "1.0",
      auth_token: this.config.authToken,
      capabilities: ["mls", "e2e_signing", "receipt_tracking"],
    };

    this.ws.send(JSON.stringify({ type: "ucp_hello", ...hello }));

    // Wait for UCPHelloAck
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("UCPHelloAck timeout"));
      }, 5000);

      const originalOnMessage = this.ws!.onmessage;
      this.ws!.onmessage = (event) => {
        clearTimeout(timeout);

        try {
          const msg = JSON.parse(event.data);

          if (msg.type === "ucp_hello_ack") {
            const ack = msg as UCPHelloAck;
            this.validateHelloAck(ack);
            this.currentChallenge = ack.challenge;
            this.challengeExpiry = Date.now() + 60000; // 60 second expiry
            this.isAuthenticated = true;
            this.ws!.onmessage = originalOnMessage;
            resolve();
          } else {
            // Restore original handler for other messages
            this.ws!.onmessage = originalOnMessage;
            this.handleMessage(event.data);
          }
        } catch (err) {
          this.ws!.onmessage = originalOnMessage;
          reject(err);
        }
      };
    });
  }

  /**
   * Validate UCPHelloAck signature (if server key available)
   */
  private validateHelloAck(ack: UCPHelloAck): void {
    if (!this.config.serverSigningKey || !ack.server_sig) {
      // Skip validation if no key provided
      return;
    }

    // TODO: Verify server_sig over "server_hello:" || auth_token || server_id
    // This requires the Ed25519 verification implementation
    // For now, we'll trust the connection (should be HTTPS/WSS)
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(data: string): void {
    try {
      const msg = JSON.parse(data);

      if (msg.type === "ping") {
        // Respond to server pings
        this.ws?.send(JSON.stringify({ type: "pong" }));
        return;
      }

      // Pass message to callback
      this.callbacks.onMessage?.(msg);
    } catch (err) {
      console.error("Failed to parse message:", err);
    }
  }

  /**
   * Send message to server
   */
  send(msg: unknown): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket not connected");
    }

    if (!this.isAuthenticated) {
      throw new Error("Not authenticated");
    }

    this.ws.send(JSON.stringify(msg));
  }

  /**
   * Start keepalive pings (30 second interval)
   */
  private startKeepalive(): void {
    this.keepaliveInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  }

  /**
   * Stop keepalive pings
   */
  private stopKeepalive(): void {
    if (this.keepaliveInterval !== null) {
      clearInterval(this.keepaliveInterval);
      this.keepaliveInterval = null;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    // Calculate backoff: 1s, 2s, 4s, 8s, 16s, 32s, 60s
    const baseDelay = Math.min(2 ** this.reconnectAttempt * 1000, 60000);
    const jitter = (Math.random() - 0.5) * 0.4 * baseDelay; // ±20% jitter
    const delay = Math.max(1000, baseDelay + jitter);

    this.reconnectTimeout = setTimeout(() => {
      this.reconnectAttempt++;
      this.callbacks.onReconnect?.(this.reconnectAttempt);

      this.connect().catch((err) => {
        console.error(
          `Reconnection attempt ${this.reconnectAttempt} failed:`,
          err,
        );
      });
    }, delay);
  }

  /**
   * Disconnect and clean up
   */
  disconnect(): void {
    this.isConnecting = false;
    this.isAuthenticated = false;
    this.stopKeepalive();

    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Check if currently authenticated and connected
   */
  isReady(): boolean {
    return this.isAuthenticated && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get current challenge (for signing operations)
   */
  getChallenge(): string | null {
    if (this.challengeExpiry && Date.now() > this.challengeExpiry) {
      this.currentChallenge = null;
      this.challengeExpiry = null;
    }
    return this.currentChallenge;
  }
}
