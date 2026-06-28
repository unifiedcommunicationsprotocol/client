import { useEffect, useCallback } from "react";

interface Message {
  id: string;
  threadId: string;
  from: string;
  ciphertext: string;
  signature: string;
  clientTs: number;
  status?: string;
}

type MessageEventHandler = (message: Message) => void;

/**
 * Hook for real-time message updates
 * Listens to message events from the server
 * Falls back to polling if WebSocket unavailable
 */
export function useMessaging(threadId: string | undefined) {
  const subscribe = useCallback(
    (handler: MessageEventHandler) => {
      if (!threadId) return () => {};

      // Build WebSocket URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/ws/subscribe?threadId=${threadId}`;

      let ws: WebSocket | null = null;
      let pollInterval: NodeJS.Timeout | null = null;
      let reconnectTimeout: NodeJS.Timeout | null = null;

      // Attempt WebSocket connection
      const connectWebSocket = () => {
        if (ws && ws.readyState === WebSocket.OPEN) return; // Already connected

        try {
          console.log(`[useMessaging] Connecting to ${wsUrl}`);
          ws = new WebSocket(wsUrl);

          ws.onopen = () => {
            console.log(`[useMessaging] Connected to thread ${threadId}`);
            // Clear polling interval if connected via WebSocket
            if (pollInterval) {
              clearInterval(pollInterval);
              pollInterval = null;
            }
          };

          ws.onmessage = (event) => {
            try {
              const payload = JSON.parse(event.data);

              // Skip subscription confirmation and ack messages
              if (payload.type === "subscribed") {
                console.log(
                  `[useMessaging] Subscribed to ${payload.threadId}`
                );
                return;
              }
              if (payload.type === "ack") {
                return;
              }

              // Handle message:received and message:status events
              if (payload.data) {
                const message: Message = payload.data;
                console.log(
                  `[useMessaging] Received ${payload.type}:`,
                  message.id
                );
                handler(message);
              }
            } catch (e) {
              console.error("[useMessaging] Failed to parse message:", e);
            }
          };

          ws.onerror = (event) => {
            console.error("[useMessaging] WebSocket error:", event);
            fallbackToPoll();
          };

          ws.onclose = () => {
            console.log("[useMessaging] WebSocket closed, reconnecting in 5s");
            // Attempt reconnection after delay
            reconnectTimeout = setTimeout(() => {
              if (!ws || ws.readyState === WebSocket.CLOSED) {
                connectWebSocket();
              }
            }, 5000);
          };
        } catch (e) {
          console.error("[useMessaging] WebSocket connection failed:", e);
          fallbackToPoll();
        }
      };

      // Fallback: Poll for new messages if WebSocket unavailable
      const fallbackToPoll = () => {
        if (pollInterval) clearInterval(pollInterval);

        console.log("[useMessaging] Falling back to polling every 5 seconds");
        pollInterval = setInterval(async () => {
          try {
            const response = await fetch(
              `/api/message/list?threadId=${threadId}&limit=10`
            );
            if (response.ok) {
              const data = await response.json();
              const messages: Message[] = data.messages || [];
              for (const msg of messages) {
                handler(msg);
              }
            }
          } catch (e) {
            console.error("[useMessaging] Poll error:", e);
          }
        }, 5000); // Poll every 5 seconds
      };

      connectWebSocket();

      // Cleanup function
      return () => {
        console.log(`[useMessaging] Unsubscribing from ${threadId}`);
        if (ws) {
          ws.close();
          ws = null;
        }
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };
    },
    [threadId]
  );

  return { subscribe };
}
