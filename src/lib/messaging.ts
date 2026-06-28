/**
 * UCP Client Real-time Messaging (Phase 4)
 * Thread management, message sending/receiving, live updates
 */

import { createEmitter, type Emitter } from "./emitter";
import type { DBClient } from "./db/client";
import type { Transport } from "./transport";
import type { Thread, Message, Draft } from "./db/schema";

export interface MessageEvent {
  type: "thread:created" | "thread:updated" | "message:received" | "message:status";
  data: unknown;
}

/**
 * Messaging service for thread and message operations
 */
export function createMessaging(db: DBClient, transport: Transport) {
  const events = createEmitter<MessageEvent>();

  const sendMessage = async (
    threadId: string,
    to: string[],
    plaintext: string,
    cc?: string[],
    bcc?: string[],
  ): Promise<Message> => {
    // Validate thread exists
    const thread = await db.getThread(threadId);
    if (!thread) {
      throw new Error(`Thread not found: ${threadId}`);
    }

    // Create message (in real implementation, encrypt with MLS)
    const message = await db.createMessage({
      threadId,
      from: "user@example.com", // In production, from config
      ciphertext: plaintext, // Would be MLS-encrypted
      signature: "sig_placeholder", // Would be Ed25519 signature
      clientTs: Date.now(),
      status: "pending",
    });

    // Send via transport if connected
    if (transport.isReady()) {
      transport.send({
        type: "message:send",
        threadId,
        messageId: message.id,
        to,
        cc,
        bcc,
      });
    }

    events.emit({
      type: "message:received",
      data: message,
    });

    return message;
  };

  const createThread = async (
    participants: string[],
    subject?: string,
  ): Promise<Thread> => {
    const groupId = `group_${Date.now()}`;

    const thread = await db.createThread({
      groupId,
      participants,
      subject,
    });

    events.emit({
      type: "thread:created",
      data: thread,
    });

    return thread;
  };

  const updateMessageStatus = async (
    messageId: string,
    status: "pending" | "sent" | "delivered" | "read",
  ): Promise<void> => {
    await db.updateMessageStatus(messageId, status);

    events.emit({
      type: "message:status",
      data: { messageId, status },
    });
  };

  const getThreadMessages = async (
    threadId: string,
    limit = 50,
  ): Promise<Message[]> => {
    return db.listThreadMessages(threadId, limit);
  };

  const saveDraft = async (
    threadId: string,
    to: string[],
    plaintext: string,
    cc?: string[],
    bcc?: string[],
    subject?: string,
  ): Promise<Draft> => {
    return db.createDraft({
      threadId,
      to,
      cc,
      bcc,
      subject,
      plaintext,
    });
  };

  const deleteDraft = async (draftId: string): Promise<void> => {
    return db.deleteDraft(draftId);
  };

  const subscribeToThread = (
    threadId: string,
    handler: (event: MessageEvent) => void,
  ): (() => void) => {
    const unsubscribe = events.on((event) => {
      // Only emit events for this thread
      if (
        (event.type === "message:received" &&
          (event.data as Message).threadId === threadId) ||
        (event.type === "message:status" &&
          (event.data as any).threadId === threadId)
      ) {
        handler(event);
      }
    });

    return unsubscribe;
  };

  const getThread = async (threadId: string): Promise<Thread | undefined> => {
    return db.getThread(threadId);
  };

  const listThreads = async (limit?: number): Promise<Thread[]> => {
    return db.listThreads(limit);
  };

  return {
    sendMessage,
    createThread,
    updateMessageStatus,
    getThreadMessages,
    saveDraft,
    deleteDraft,
    subscribeToThread,
    getThread,
    listThreads,
    events,
  };
}

export type Messaging = ReturnType<typeof createMessaging>;
