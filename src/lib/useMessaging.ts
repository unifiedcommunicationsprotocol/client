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

      // Try WebSocket first
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/message/subscribe?threadId=${threadId}`;

      let ws: WebSocket | null = null;
      let pollInterval: NodeJS.Timeout | null = null;

      // Attempt WebSocket connection
      const connectWebSocket = () => {
        try {
          ws = new WebSocket(wsUrl);

          ws.onmessage = (event) => {
            try {
              const message: Message = JSON.parse(event.data);
              handler(message);
            } catch (e) {
              console.error("Failed to parse WebSocket message:", e);
            }
          };

          ws.onerror = () => {
            console.log("WebSocket error, falling back to polling");
            fallbackToPoll();
          };

          ws.onclose = () => {
            console.log("WebSocket closed");
            // Reconnect after delay
            setTimeout(() => {
              if (ws?.readyState === WebSocket.CLOSED) {
                connectWebSocket();
              }
            }, 5000);
          };
        } catch (e) {
          console.error("WebSocket connection failed:", e);
          fallbackToPoll();
        }
      };

      // Fallback: Poll for new messages
      const fallbackToPoll = () => {
        if (pollInterval) clearInterval(pollInterval);

        pollInterval = setInterval(async () => {
          try {
            const response = await fetch(
              `/api/message/list?threadId=${threadId}&limit=1`
            );
            if (response.ok) {
              const data = await response.json();
              const latestMessage = data.messages?.[0];
              if (latestMessage) {
                handler(latestMessage);
              }
            }
          } catch (e) {
            console.error("Poll error:", e);
          }
        }, 5000); // Poll every 5 seconds
      };

      connectWebSocket();

      // Cleanup function
      return () => {
        if (ws) {
          ws.close();
          ws = null;
        }
        if (pollInterval) {
          clearInterval(pollInterval);
          pollInterval = null;
        }
      };
    },
    [threadId]
  );

  return { subscribe };
}
