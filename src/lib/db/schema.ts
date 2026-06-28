/**
 * UCP Client Database Schema (Drizzle ORM)
 * PostgreSQL 18+ for server state; IndexedDB for browser cache
 */

import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * Threads: Conversations (maps to MLS groups)
 */
export const threads = pgTable(
  "threads",
  {
    id: varchar("id", { length: 26 }).primaryKey(), // ULID
    groupId: varchar("group_id", { length: 64 }).notNull().unique(), // SHA-256 hash
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    subject: varchar("subject", { length: 255 }),
    participants: jsonb("participants").notNull(), // Array of addresses
    metadata: jsonb("metadata"), // AI: category, summary, etc.
  },
  (table) => ({
    groupIdIdx: uniqueIndex("idx_threads_group_id").on(table.groupId),
    createdIdx: index("idx_threads_created").on(table.createdAt),
  }),
);

/**
 * Messages: Encrypted content
 */
export const messages = pgTable(
  "messages",
  {
    id: varchar("id", { length: 26 }).primaryKey(), // ULID
    threadId: varchar("thread_id", { length: 26 })
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    from: varchar("from", { length: 255 }).notNull(),
    ciphertext: text("ciphertext").notNull(), // MLS-encrypted
    signature: text("signature").notNull(), // Ed25519
    clientTs: integer("client_ts").notNull(), // Unix milliseconds
    serverTs: integer("server_ts"), // Assigned by server
    status: varchar("status", { length: 20 }).notNull().default("pending"), // pending|sent|delivered|read
    metadata: jsonb("metadata"), // blocks, marks, etc.
  },
  (table) => ({
    threadIdIdx: index("idx_messages_thread_id").on(table.threadId),
    clientTsIdx: index("idx_messages_client_ts").on(table.clientTs),
    statusIdx: index("idx_messages_status").on(table.status),
    fromIdx: index("idx_messages_from").on(table.from),
  }),
);

/**
 * Keys: Ed25519 signing keys (one active, others archived)
 */
export const keys = pgTable(
  "keys",
  {
    id: varchar("id", { length: 26 }).primaryKey(), // ULID
    address: varchar("address", { length: 255 }).notNull(),
    keyType: varchar("key_type", { length: 20 }).notNull(), // signing|identity
    publicKey: varchar("public_key", { length: 512 }).notNull(),
    secretKeyEncrypted: text("secret_key_encrypted").notNull(), // Encrypted with identity key
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
    status: varchar("status", { length: 20 }).notNull().default("active"), // active|grace_period|expired
    metadata: jsonb("metadata"), // fingerprint, algorithm, etc.
  },
  (table) => ({
    addressIdx: index("idx_keys_address").on(table.address),
    statusIdx: index("idx_keys_status").on(table.status),
    expiresIdx: index("idx_keys_expires").on(table.expiresAt),
  }),
);

/**
 * Identities: Cached remote identities
 */
export const identities = pgTable(
  "identities",
  {
    address: varchar("address", { length: 255 }).primaryKey(),
    signingPublicKey: varchar("signing_public_key", { length: 512 }).notNull(),
    signingKeyId: varchar("signing_key_id", { length: 64 }),
    identityPublicKey: varchar("identity_public_key", { length: 512 }),
    dnsServerUrl: varchar("dns_server_url", { length: 512 }),
    resolvedAt: timestamp("resolved_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => ({
    expiresIdx: index("idx_identities_expires").on(table.expiresAt),
  }),
);

/**
 * Attachments: File metadata
 */
export const attachments = pgTable(
  "attachments",
  {
    id: varchar("id", { length: 26 }).primaryKey(), // ULID
    messageId: varchar("message_id", { length: 26 })
      .notNull()
      .references(() => messages.id, { onDelete: "cascade" }),
    filename: varchar("filename", { length: 512 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    contentHash: varchar("content_hash", { length: 128 }).notNull(), // SHA-256
    contentUri: varchar("content_uri", { length: 1024 }).notNull(), // Server endpoint
    createdAt: timestamp("created_at").notNull().defaultNow(),
    metadata: jsonb("metadata"), // thumbnail, preview, etc.
  },
  (table) => ({
    messageIdIdx: index("idx_attachments_message_id").on(table.messageId),
    contentHashIdx: index("idx_attachments_content_hash").on(table.contentHash),
  }),
);

/**
 * Drafts: Unsent messages
 */
export const drafts = pgTable(
  "drafts",
  {
    id: varchar("id", { length: 26 }).primaryKey(), // ULID
    threadId: varchar("thread_id", { length: 26 })
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    to: jsonb("to").notNull(), // Array of addresses
    cc: jsonb("cc"), // Optional
    bcc: jsonb("bcc"), // Optional
    subject: varchar("subject", { length: 255 }),
    plaintext: text("plaintext").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    threadIdIdx: index("idx_drafts_thread_id").on(table.threadId),
    updatedIdx: index("idx_drafts_updated").on(table.updatedAt),
  }),
);

/**
 * Sessions: Active connections
 */
export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(), // Bearer token
    address: varchar("address", { length: 255 }).notNull(),
    deviceId: varchar("device_id", { length: 64 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(), // 24 hours
    lastActivityAt: timestamp("last_activity_at").notNull(),
  },
  (table) => ({
    addressIdx: index("idx_sessions_address").on(table.address),
    expiresIdx: index("idx_sessions_expires").on(table.expiresAt),
  }),
);

/**
 * Type exports for TypeScript
 */
export type Thread = typeof threads.$inferSelect;
export type ThreadInsert = typeof threads.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type MessageInsert = typeof messages.$inferInsert;

export type Key = typeof keys.$inferSelect;
export type KeyInsert = typeof keys.$inferInsert;

export type Identity = typeof identities.$inferSelect;
export type IdentityInsert = typeof identities.$inferInsert;

export type Attachment = typeof attachments.$inferSelect;
export type AttachmentInsert = typeof attachments.$inferInsert;

export type Draft = typeof drafts.$inferSelect;
export type DraftInsert = typeof drafts.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type SessionInsert = typeof sessions.$inferInsert;
