/**
 * UCP Client Ed25519 Signing & Verification
 * Uses tweetnacl.js for Ed25519 operations
 */

// Lazy load tweetnacl to avoid bundling issues in SSR context
let nacl: any = null;

async function getNacl() {
  if (nacl) return nacl;
  nacl = await import("tweetnacl");
  return nacl;
}

export interface KeyPair {
  publicKey: string; // base64
  secretKey: string; // base64 (keep secret!)
}

export interface SigningKeyPair {
  publicKey: string; // base64 (for publishing)
  secretKey: string; // base64 (keep on device)
  createdAt: number; // timestamp when generated
  expiresAt: number; // timestamp (60 days from now)
  revoked: boolean;
}

/**
 * Generate a new Ed25519 keypair
 */
export async function generateKeyPair(): Promise<KeyPair> {
  const lib = await getNacl();
  const keyPair = lib.sign.keyPair();

  return {
    publicKey: lib.util.encodeBase64(keyPair.publicKey),
    secretKey: lib.util.encodeBase64(keyPair.secretKey),
  };
}

/**
 * Generate a new signing key (with expiration)
 */
export async function generateSigningKey(): Promise<SigningKeyPair> {
  const keyPair = await generateKeyPair();
  const now = Date.now();
  const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;

  return {
    publicKey: keyPair.publicKey,
    secretKey: keyPair.secretKey,
    createdAt: now,
    expiresAt: now + sixtyDaysMs,
    revoked: false,
  };
}

/**
 * Sign a message (canonical JSON) with Ed25519
 * Returns signature as base64
 */
export async function signMessage(
  message: unknown,
  secretKeyBase64: string,
): Promise<string> {
  const lib = await getNacl();

  // Canonical JSON: sorted keys, no whitespace, UTF-8
  const canonical = canonicalJson(message);
  const messageBytes = new TextEncoder().encode(canonical);

  // Decode secret key
  const secretKeyBytes = lib.util.decodeBase64(secretKeyBase64);

  // Sign
  const signature = lib.sign.detached(messageBytes, secretKeyBytes);

  // Return as base64
  return lib.util.encodeBase64(signature);
}

/**
 * Verify a message signature
 * Returns true if signature is valid
 */
export async function verifySignature(
  message: unknown,
  signatureBase64: string,
  publicKeyBase64: string,
): Promise<boolean> {
  const lib = await getNacl();

  try {
    // Canonical JSON
    const canonical = canonicalJson(message);
    const messageBytes = new TextEncoder().encode(canonical);

    // Decode signature and key
    const signatureBytes = lib.util.decodeBase64(signatureBase64);
    const publicKeyBytes = lib.util.decodeBase64(publicKeyBase64);

    // Verify
    return lib.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes,
    );
  } catch {
    return false;
  }
}

/**
 * Convert a public key to signing key format (for compatibility)
 */
export function publicKeyToSigningKey(publicKeyBase64: string): SigningKeyPair {
  const now = Date.now();
  const sixtyDaysMs = 60 * 24 * 60 * 60 * 1000;

  return {
    publicKey: publicKeyBase64,
    secretKey: "", // No secret key for remote keys
    createdAt: now,
    expiresAt: now + sixtyDaysMs,
    revoked: false,
  };
}

/**
 * Canonical JSON serialization (RFC 9420 § 2)
 * - Sort keys alphabetically
 * - No whitespace
 * - UTF-8 encoding
 * - Strings escaped as per JSON spec
 */
function canonicalJson(obj: unknown): string {
  if (obj === null) return "null";
  if (typeof obj === "boolean") return obj ? "true" : "false";
  if (typeof obj === "number") {
    // Ensure integer representation
    if (!Number.isFinite(obj)) throw new Error("Non-finite number");
    return String(obj);
  }
  if (typeof obj === "string") {
    // JSON string escaping
    return JSON.stringify(obj);
  }

  if (Array.isArray(obj)) {
    const elements = obj.map((item) => canonicalJson(item));
    return `[${elements.join(",")}]`;
  }

  if (typeof obj === "object") {
    const keys = Object.keys(obj).sort();
    const pairs = keys.map((key) => {
      const value = (obj as Record<string, unknown>)[key];
      return `${JSON.stringify(key)}:${canonicalJson(value)}`;
    });
    return `{${pairs.join(",")}}`;
  }

  throw new Error(`Cannot serialize type: ${typeof obj}`);
}

/**
 * Hash a value with SHA-256
 */
export async function hashSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * Derive a thread ID from thread parameters
 * Format: ULID (sender-generated)
 */
export function generateThreadId(): string {
  // Simple ULID-like implementation (16 chars base32)
  // For now, use crypto.getRandomValues + timestamp
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
