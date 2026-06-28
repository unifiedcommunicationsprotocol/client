/**
 * PostgreSQL Database Client (Drizzle ORM)
 * Production database client for server-side storage
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc } from "drizzle-orm";
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
import type { DBClient } from "./client";

/**
 * Create PostgreSQL database client
 * Requires DATABASE_URL environment variable
 * Example: postgresql://user:password@localhost:5432/dbname
 */
export function createPostgresDBClient(): DBClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL environment variable not set. Required format: postgresql://user:password@host:port/dbname"
    );
  }

  // Create postgres connection pool
  const client = postgres(databaseUrl, {
    prepare: false, // Disable prepared statements for compatibility
  });

  const db = drizzle(client);

  return {
    // Threads
    async createThread(thread: ThreadInsert): Promise<Thread> {
      const result = await db
        .insert(threads)
        .values({
          ...thread,
          id: thread.id || `thread_${Date.now()}`,
        })
        .returning();
      return result[0];
    },

    async getThread(threadId: string): Promise<Thread | undefined> {
      const result = await db
        .select()
        .from(threads)
        .where(eq(threads.id, threadId));
      return result[0];
    },

    async listThreads(limit = 50): Promise<Thread[]> {
      return db
        .select()
        .from(threads)
        .orderBy(desc(threads.updatedAt))
        .limit(limit);
    },

    async updateThread(
      threadId: string,
      updates: Partial<Thread>
    ): Promise<void> {
      await db
        .update(threads)
        .set({
          ...updates,
          updatedAt: new Date(),
        })
        .where(eq(threads.id, threadId));
    },

    // Messages
    async createMessage(message: MessageInsert): Promise<Message> {
      const result = await db
        .insert(messages)
        .values({
          ...message,
          id: message.id || `msg_${Date.now()}`,
          serverTs: Math.floor(Date.now()),
        })
        .returning();
      return result[0];
    },

    async getMessage(messageId: string): Promise<Message | undefined> {
      const result = await db
        .select()
        .from(messages)
        .where(eq(messages.id, messageId));
      return result[0];
    },

    async listThreadMessages(
      threadId: string,
      limit = 50
    ): Promise<Message[]> {
      return db
        .select()
        .from(messages)
        .where(eq(messages.threadId, threadId))
        .orderBy(desc(messages.clientTs))
        .limit(limit);
    },

    async updateMessageStatus(
      messageId: string,
      status: string
    ): Promise<void> {
      await db
        .update(messages)
        .set({ status })
        .where(eq(messages.id, messageId));
    },

    // Keys
    async createKey(key: KeyInsert): Promise<Key> {
      const result = await db
        .insert(keys)
        .values({
          ...key,
          id: key.id || `key_${Date.now()}`,
        })
        .returning();
      return result[0];
    },

    async getActiveKey(address: string): Promise<Key | undefined> {
      const result = await db
        .select()
        .from(keys)
        .where((t) => eq(t.address, address) && eq(t.status, "active"))
        .limit(1);
      return result[0];
    },

    async listKeysByAddress(address: string): Promise<Key[]> {
      return db.select().from(keys).where(eq(keys.address, address));
    },

    async updateKeyStatus(keyId: string, status: string): Promise<void> {
      await db.update(keys).set({ status }).where(eq(keys.id, keyId));
    },

    // Drafts
    async createDraft(draft: DraftInsert): Promise<Draft> {
      const result = await db
        .insert(drafts)
        .values({
          ...draft,
          id: draft.id || `draft_${Date.now()}`,
        })
        .returning();
      return result[0];
    },

    async getDraft(draftId: string): Promise<Draft | undefined> {
      const result = await db
        .select()
        .from(drafts)
        .where(eq(drafts.id, draftId));
      return result[0];
    },

    async listDraftsByThread(threadId: string): Promise<Draft[]> {
      return db
        .select()
        .from(drafts)
        .where(eq(drafts.threadId, threadId));
    },

    async deleteDraft(draftId: string): Promise<void> {
      await db.delete(drafts).where(eq(drafts.id, draftId));
    },

    // Sessions
    async createSession(session: SessionInsert): Promise<Session> {
      const result = await db
        .insert(sessions)
        .values({
          ...session,
          id: session.id || `sess_${Date.now()}`,
        })
        .returning();
      return result[0];
    },

    async getSession(sessionId: string): Promise<Session | undefined> {
      const result = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId));
      return result[0];
    },

    async updateSessionActivity(sessionId: string): Promise<void> {
      await db
        .update(sessions)
        .set({ lastActivityAt: new Date() })
        .where(eq(sessions.id, sessionId));
    },

    async expireSessions(): Promise<number> {
      const now = new Date();
      const result = await db
        .delete(sessions)
        .where((t) => t.expiresAt < now);
      return 0; // Drizzle doesn't return count for delete
    },
  };
}
