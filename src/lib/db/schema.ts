import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Identity & Keys
export const identities = pgTable("identities", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull().unique(),
  identity_key: text("identity_key").notNull(), // Base64 Ed25519 public key
  identity_key_backup: text("identity_key_backup"), // For recovery
  current_signing_key: text("current_signing_key").notNull(),
  signing_key_expires_at: timestamp("signing_key_expires_at").notNull(),
  grace_signing_key: text("grace_signing_key"), // Previous key in grace period
  grace_expires_at: timestamp("grace_expires_at"),
  revocation_key: text("revocation_key"), // Offline only
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Threads (conversations)
export const threads = pgTable("threads", {
  id: text("id").primaryKey(), // ULID from sender
  identity_id: uuid("identity_id").notNull(),
  recipients: jsonb("recipients").$type<string[]>().notNull(), // Array of addresses
  subject: text("subject"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  last_message_at: timestamp("last_message_at"),
});

// MLS Groups
export const groups = pgTable("groups", {
  id: text("id").primaryKey(), // SHA-256(group:thread_id)
  thread_id: text("thread_id").notNull(),
  is_bcc: boolean("is_bcc").default(false).notNull(),
  bcc_recipient: text("bcc_recipient"), // Recipient address if BCC group
  epoch: integer("epoch").default(0).notNull(),
  tree_state: text("tree_state"), // MLS group state (base64)
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Messages
export const messages = pgTable("messages", {
  id: text("id").primaryKey(), // ULID
  thread_id: text("thread_id").notNull(),
  from: text("from").notNull(),
  subject: text("subject"),
  body_blocks: jsonb("body_blocks").$type<object[]>().notNull(), // Array of content blocks
  attachments: jsonb("attachments").$type<object[]>().default([]),
  client_ts: timestamp("client_ts").notNull(),
  server_ts: timestamp("server_ts").defaultNow().notNull(),
  signature: text("signature"), // Base64 Ed25519 signature
  encrypted_payload: text("encrypted_payload"), // Base64 MLS ciphertext
  in_reply_to: text("in_reply_to"),
  references: jsonb("references").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<object>().default({}),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// KeyPackages (cached)
export const keypackages = pgTable("keypackages", {
  id: uuid("id").primaryKey().defaultRandom(),
  address: text("address").notNull(),
  signing_key: text("signing_key").notNull(),
  keypackage: text("keypackage").notNull(), // Base64 MLS KeyPackage
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Sessions
export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  identity_id: uuid("identity_id").notNull(),
  token: text("token").notNull().unique(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Drafts
export const drafts = pgTable("drafts", {
  id: text("id").primaryKey(),
  identity_id: uuid("identity_id").notNull(),
  thread_id: text("thread_id"),
  recipients: jsonb("recipients").$type<string[]>().notNull(),
  subject: text("subject"),
  body_blocks: jsonb("body_blocks").$type<object[]>().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
