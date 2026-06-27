/**
 * React hook for managing UCP WebSocket transport (Functional)
 */

import { useEffect, useRef, useState } from "react";
import {
  createTransport,
  type Transport,
  type TransportConfig,
} from "./transport";

export interface UseTransportState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  reconnectAttempt: number;
  lastMessage: unknown | null;
}

export const useTransport = (config: TransportConfig | null) => {
  const transportRef = useRef<Transport | null>(null);
  const [state, setState] = useState<UseTransportState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    reconnectAttempt: 0,
    lastMessage: null,
  });

  useEffect(() => {
    if (!config) return;

    if (!transportRef.current) {
      transportRef.current = createTransport(config, {
        onOpen: () => {
          setState((prev) => ({
            ...prev,
            isConnected: true,
            isConnecting: false,
            error: null,
          }));
        },

        onMessage: (msg: unknown) => {
          setState((prev) => ({
            ...prev,
            lastMessage: msg,
          }));
        },

        onError: (err: Error) => {
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

        onReconnect: (attempt: number) => {
          setState((prev) => ({
            ...prev,
            isConnecting: true,
            reconnectAttempt: attempt,
          }));
        },
      });
    }

    setState((prev) => ({ ...prev, isConnecting: true }));
    transportRef.current.connect().catch((err: Error) => {
      setState((prev) => ({
        ...prev,
        error: err,
        isConnecting: false,
      }));
    });

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
};
