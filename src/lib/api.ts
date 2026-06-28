/**
 * UCP Client Message Envelope Handling
 * Serialization and deserialization of UCPEnvelope (Phase 1)
 */

import { z } from "zod";

export interface UCPEnvelope {
  message_id: string; // Sender-generated ULID
  from: string; // Sender address
  to: string[]; // Primary recipients
  cc?: string[]; // CC recipients
  bcc?: string[]; // BCC recipients (hidden from others)
  subject?: string; // Message subject
  sent_at: number; // Client timestamp (Unix ms)
  message_ciphertext: string; // MLS-encrypted content (base64)
  signature: string; // Ed25519 signature over envelope headers (base64)
  server_ts?: number; // Server timestamp (assigned server-side)
  server_sig?: string; // Server signature (for verification)
}

const EnvelopeSchema = z.object({
  message_id: z.string(),
  from: z.string().email(),
  to: z.array(z.string().email()),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
  subject: z.string().optional(),
  sent_at: z.number().int().positive(),
  message_ciphertext: z.string(),
  signature: z.string(),
  server_ts: z.number().int().optional(),
  server_sig: z.string().optional(),
});

/**
 * Generate a message ID (ULID-like)
 */
function generateMessageId(): string {
  const timestamp = Date.now();
  const timestampBase32 = timestamp.toString(32).padStart(10, "0");
  const randomBytes = new Uint8Array(6);
  crypto.getRandomValues(randomBytes);
  const randomBase32 = Array.from(randomBytes)
    .map((b) => b.toString(32).padStart(2, "0"))
    .join("")
    .slice(0, 12);

  return `${timestampBase32}${randomBase32}`.toUpperCase();
}

/**
 * Create a new envelope
 */
export function createEnvelope(params: {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  messageContent: unknown;
  ciphertext: string; // MLS-encrypted content
  signature: string; // Ed25519 signature
}): UCPEnvelope {
  return {
    message_id: generateMessageId(),
    from: params.from,
    to: params.to,
    cc: params.cc,
    bcc: params.bcc,
    subject: params.subject,
    sent_at: Date.now(),
    message_ciphertext: params.ciphertext,
    signature: params.signature,
  };
}

/**
 * Parse and validate an envelope from JSON
 */
export function parseEnvelope(json: string): UCPEnvelope {
  const data = JSON.parse(json);
  return EnvelopeSchema.parse(data);
}

/**
 * Serialize envelope to JSON string
 */
export function serializeEnvelope(envelope: UCPEnvelope): string {
  return JSON.stringify(envelope);
}

/**
 * Validate envelope structure
 */
export function isValidEnvelope(envelope: unknown): envelope is UCPEnvelope {
  try {
    EnvelopeSchema.parse(envelope);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extract canonical JSON for signature verification
 * (signs envelope headers, not the ciphertext)
 */
export function getEnvelopeCanonical(envelope: UCPEnvelope): string {
  const canonical = {
    from: envelope.from,
    to: envelope.to.sort(),
    cc: envelope.cc?.sort(),
    bcc: envelope.bcc?.sort(),
    subject: envelope.subject,
    sent_at: envelope.sent_at,
    message_ciphertext: envelope.message_ciphertext,
  };

  // Remove undefined fields
  const cleaned = Object.fromEntries(
    Object.entries(canonical).filter(([, v]) => v !== undefined),
  );

  return JSON.stringify(cleaned);
}
