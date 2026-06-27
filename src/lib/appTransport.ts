/**
 * App-level transport integration
 * Bridges React state with WebSocket transport lifecycle
 */

import type { Transport, TransportConfig } from "./transport";
import { createTransport } from "./transport";

export interface AppTransportState {
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  reconnectAttempt: number;
}

/**
 * Create app transport with state callbacks
 */
export const createAppTransport = (
  config: TransportConfig,
  onStateChange: (state: AppTransportState) => void,
) => {
  const transport = createTransport(config, {
    onOpen: () => {
      onStateChange({
        isConnected: true,
        isConnecting: false,
        error: null,
        reconnectAttempt: 0,
      });
    },

    onError: (err) => {
      onStateChange({
        isConnected: false,
        isConnecting: false,
        error: err,
        reconnectAttempt: 0,
      });
    },

    onClose: () => {
      onStateChange({
        isConnected: false,
        isConnecting: false,
        error: null,
        reconnectAttempt: 0,
      });
    },

    onReconnect: (attempt) => {
      onStateChange({
        isConnected: false,
        isConnecting: true,
        error: null,
        reconnectAttempt: attempt,
      });
    },

    onMessage: (_msg) => {
      // Messages handled at app level via AppContext
    },
  });

  return transport;
};

export type AppTransport = Transport;
