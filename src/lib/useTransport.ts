/**
 * React hook for managing UCP WebSocket transport
 */

import { useEffect, useRef, useState } from "react";
import { type TransportConfig, UCPTransport } from "./transport";

export interface UseTransportState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  reconnectAttempt: number;
  lastMessage: unknown | null;
}

export function useTransport(config: TransportConfig | null) {
  const transportRef = useRef<UCPTransport | null>(null);
  const [state, setState] = useState<UseTransportState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempt: 0,
    lastMessage: null,
  });

  useEffect(() => {
    if (!config) return;

    // Create transport if needed
    if (!transportRef.current) {
      transportRef.current = new UCPTransport(config, {
        onOpen: () => {
          setState((prev) => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            error: null,
          }));
        },

        onMessage: (msg) => {
          setState((prev) => ({
            ...prev,
            lastMessage: msg,
          }));
        },

        onError: (err) => {
          setState((prev) => ({
            ...prev,
            error: err,
            isConnecting: false,
          }));
        },

        onClose: () => {
          setState((prev) => ({
            ...prev,
            isConnected: false,
          }));
        },

        onReconnect: (attempt) => {
          setState((prev) => ({
            ...prev,
            isConnecting: true,
            reconnectAttempt: attempt,
          }));
        },
      });
    }

    // Connect
    setState((prev) => ({ ...prev, isConnecting: true }));
    transportRef.current.connect().catch((err) => {
      setState((prev) => ({
        ...prev,
        error: err,
        isConnecting: false,
      }));
    });

    // Cleanup on unmount
    return () => {
      transportRef.current?.disconnect();
    };
  }, [config]);

  return {
    ...state,
    send: (msg: unknown) => {
      if (transportRef.current) {
        transportRef.current.send(msg);
      }
    },
    disconnect: () => {
      transportRef.current?.disconnect();
    },
  };
}
