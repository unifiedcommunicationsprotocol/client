/**
 * UCP Client Offline Support (Phase 6)
 * Message queueing, offline state management, sync on reconnect
 */

export interface QueuedMessage {
  id: string;
  threadId: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  plaintext: string;
  timestamp: number;
  status: "queued" | "retrying" | "failed";
  retryCount: number;
  error?: string;
}

export interface OfflineState {
  isOnline: boolean;
  queuedMessageCount: number;
  pendingMessageCount: number;
  lastSyncTime?: number;
}

/**
 * Offline message queue manager
 */
export function createOfflineQueue() {
  const queue = new Map<string, QueuedMessage>();
  let isOnline = navigator.onLine ?? true;

  const addToQueue = (message: Omit<QueuedMessage, "id" | "status" | "retryCount" | "error">): string => {
    const id = `queued_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const queuedMsg: QueuedMessage = {
      ...message,
      id,
      status: "queued",
      retryCount: 0,
    };

    queue.set(id, queuedMsg);
    return id;
  };

  const getQueuedMessage = (id: string): QueuedMessage | undefined => {
    return queue.get(id);
  };

  const listQueuedMessages = (): QueuedMessage[] => {
    return Array.from(queue.values());
  };

  const updateQueuedMessage = (
    id: string,
    updates: Partial<QueuedMessage>,
  ): void => {
    const msg = queue.get(id);
    if (msg) {
      queue.set(id, { ...msg, ...updates });
    }
  };

  const removeFromQueue = (id: string): void => {
    queue.delete(id);
  };

  const clearQueue = (): void => {
    queue.clear();
  };

  const incrementRetry = (id: string): void => {
    const msg = queue.get(id);
    if (msg) {
      msg.retryCount++;
      if (msg.retryCount >= 3) {
        msg.status = "failed";
      } else {
        msg.status = "retrying";
      }
    }
  };

  const setOnlineStatus = (online: boolean): void => {
    isOnline = online;
  };

  const getOnlineStatus = (): boolean => {
    return isOnline;
  };

  const getOfflineState = (): OfflineState => ({
    isOnline,
    queuedMessageCount: queue.size,
    pendingMessageCount: Array.from(queue.values()).filter(
      (m) => m.status === "queued" || m.status === "retrying",
    ).length,
  });

  return {
    addToQueue,
    getQueuedMessage,
    listQueuedMessages,
    updateQueuedMessage,
    removeFromQueue,
    clearQueue,
    incrementRetry,
    setOnlineStatus,
    getOnlineStatus,
    getOfflineState,
  };
}

export type OfflineQueue = ReturnType<typeof createOfflineQueue>;
