/**
 * Simple event emitter for pub/sub messaging
 * Used by messaging, transport, and UI components
 */

export interface Emitter<T> {
  on(handler: (event: T) => void): () => void;
  emit(event: T): void;
  off(handler: (event: T) => void): void;
}

export function createEmitter<T>(): Emitter<T> {
  const handlers = new Set<(event: T) => void>();

  return {
    on(handler: (event: T) => void): () => void {
      handlers.add(handler);
      return () => {
        handlers.delete(handler);
      };
    },

    emit(event: T): void {
      for (const handler of handlers) {
        try {
          handler(event);
        } catch (err) {
          console.error("Event handler error:", err);
        }
      }
    },

    off(handler: (event: T) => void): void {
      handlers.delete(handler);
    },
  };
}
