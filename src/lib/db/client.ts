/**
 * UCP Client Database Client (Drizzle + PostgreSQL)
 * Abstraction for thread, message, key, and session management
 */

import { eq, desc, and, gte, lte } from "drizzle-orm";
import {
  threads,
  messages,
  keys,
  identities,
  attachments,
  drafts,
  sessions,
  type Thread,
  type ThreadInsert,
  type Message,
  type MessageInsert,
  type Key,
  type KeyInsert,
  type Draft,
  type DraftInsert,
  type Session,
  type SessionInsert,
} from "./schema";

/**
 * Database client interface
 * In production, this wraps a Drizzle client connected to PostgreSQL
 */
export interface DBClient {
  // Threads
  createThread(thread: ThreadInsert): Promise<Thread>;
  getThread(threadId: string): Promise<Thread | undefined>;
  listThreads(limit?: number): Promise<Thread[]>;
  updateThread(threadId: string, updates: Partial<Thread>): Promise<void>;

  // Messages
  createMessage(message: MessageInsert): Promise<Message>;
  getMessage(messageId: string): Promise<Message | undefined>;
  listThreadMessages(
    threadId: string,
    limit?: number,
  ): Promise<Message[]>;
  updateMessageStatus(
    messageId: string,
    status: string,
  ): Promise<void>;

  // Keys
  createKey(key: KeyInsert): Promise<Key>;
  getActiveKey(address: string): Promise<Key | undefined>;
  listKeysByAddress(address: string): Promise<Key[]>;
  updateKeyStatus(keyId: string, status: string): Promise<void>;

  // Drafts
  createDraft(draft: DraftInsert): Promise<Draft>;
  getDraft(draftId: string): Promise<Draft | undefined>;
  listDraftsByThread(threadId: string): Promise<Draft[]>;
  deleteDraft(draftId: string): Promise<void>;

  // Sessions
  createSession(session: SessionInsert): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  updateSessionActivity(sessionId: string): Promise<void>;
  expireSessions(): Promise<number>; // Returns count of expired sessions
}

/**
 * In-memory database client for testing
 * Simulates PostgreSQL behavior without actual database
 */
export function createMemoryDBClient(): DBClient {
  const threadStore = new Map<string, Thread>();
  const messageStore = new Map<string, Message>();
  const keyStore = new Map<string, Key>();
  const draftStore = new Map<string, Draft>();
  const sessionStore = new Map<string, Session>();

  const generateId = (): string => {
    return `id_${Math.random().toString(36).slice(2, 9)}`;
  };

  return {
    // Threads
    async createThread(thread: ThreadInsert): Promise<Thread> {
      const id = generateId();
      const created: Thread = {
        ...(thread as Thread),
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      threadStore.set(id, created);
      return created;
    },

    async getThread(threadId: string): Promise<Thread | undefined> {
      return threadStore.get(threadId);
    },

    async listThreads(limit = 50): Promise<Thread[]> {
      return Array.from(threadStore.values()).slice(0, limit);
    },

    async updateThread(
      threadId: string,
      updates: Partial<Thread>,
    ): Promise<void> {
      const thread = threadStore.get(threadId);
      if (thread) {
        threadStore.set(threadId, {
          ...thread,
          ...updates,
          updatedAt: new Date(),
        });
      }
    },

    // Messages
    async createMessage(message: MessageInsert): Promise<Message> {
      const id = generateId();
      const created: Message = {
        ...(message as Message),
        id,
        status: "pending",
      };
      messageStore.set(id, created);
      return created;
    },

    async getMessage(messageId: string): Promise<Message | undefined> {
      return messageStore.get(messageId);
    },

    async listThreadMessages(
      threadId: string,
      limit = 50,
    ): Promise<Message[]> {
      return Array.from(messageStore.values())
        .filter((m) => m.threadId === threadId)
        .sort((a, b) => (a.clientTs || 0) - (b.clientTs || 0))
        .slice(0, limit);
    },

    async updateMessageStatus(
      messageId: string,
      status: string,
    ): Promise<void> {
      const msg = messageStore.get(messageId);
      if (msg) {
        messageStore.set(messageId, { ...msg, status });
      }
    },

    // Keys
    async createKey(key: KeyInsert): Promise<Key> {
      const id = generateId();
      const created: Key = {
        ...(key as Key),
        id,
        createdAt: new Date(),
        status: "active",
      };
      keyStore.set(id, created);
      return created;
    },

    async getActiveKey(address: string): Promise<Key | undefined> {
      return Array.from(keyStore.values()).find(
        (k) => k.address === address && k.status === "active",
      );
    },

    async listKeysByAddress(address: string): Promise<Key[]> {
      return Array.from(keyStore.values()).filter((k) => k.address === address);
    },

    async updateKeyStatus(keyId: string, status: string): Promise<void> {
      const key = keyStore.get(keyId);
      if (key) {
        keyStore.set(keyId, { ...key, status });
      }
    },

    // Drafts
    async createDraft(draft: DraftInsert): Promise<Draft> {
      const id = generateId();
      const created: Draft = {
        ...(draft as Draft),
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      draftStore.set(id, created);
      return created;
    },

    async getDraft(draftId: string): Promise<Draft | undefined> {
      return draftStore.get(draftId);
    },

    async listDraftsByThread(threadId: string): Promise<Draft[]> {
      return Array.from(draftStore.values()).filter(
        (d) => d.threadId === threadId,
      );
    },

    async deleteDraft(draftId: string): Promise<void> {
      draftStore.delete(draftId);
    },

    // Sessions
    async createSession(session: SessionInsert): Promise<Session> {
      const created: Session = {
        ...(session as Session),
        createdAt: new Date(),
        lastActivityAt: new Date(),
      };
      sessionStore.set(session.id as string, created);
      return created;
    },

    async getSession(sessionId: string): Promise<Session | undefined> {
      return sessionStore.get(sessionId);
    },

    async updateSessionActivity(sessionId: string): Promise<void> {
      const session = sessionStore.get(sessionId);
      if (session) {
        sessionStore.set(sessionId, {
          ...session,
          lastActivityAt: new Date(),
        });
      }
    },

    async expireSessions(): Promise<number> {
      const now = new Date();
      let count = 0;
      for (const [id, session] of sessionStore) {
        if (session.expiresAt < now) {
          sessionStore.delete(id);
          count++;
        }
      }
      return count;
    },
  };
}
