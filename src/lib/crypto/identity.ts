/**
 * UCP Client Identity Resolution
 * Handles DNS lookups and key verification
 */

import { verifySignature } from "./signing";

export interface Identity {
  address: string; // user@domain.com format
  signingPublicKey: string; // Current signing key (base64)
  signingKeyId: string; // Key version/rotation counter
  identityPublicKey?: string; // Identity key (optional, for verification)
  dnsServerUrl?: string; // Where identity was resolved from
  resolvedAt: number; // Timestamp when resolved
  expiresAt: number; // Cache expiration
}

// DnsRecord interface reserved for future DNS fallback implementation

interface IdentityEndpointResponse {
  address: string;
  signing_key: {
    public_key: string;
    created_at: number;
    expires_at: number;
    identity_sig?: string; // Signature binding signing key to identity
  };
  server_key?: {
    public_key: string;
    created_at: number;
  };
}

// In-memory cache for identity lookups
const identityCache = new Map<string, Identity>();

/**
 * Resolve a UCP address to get signing keys and verify identity
 * Returns cached result if available and not expired
 */
export async function resolveIdentity(address: string): Promise<Identity> {
  // Check cache
  const cached = identityCache.get(address);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }

  // Parse address (user@domain)
  const [, domain] = address.split("@");
  if (!domain) {
    throw new Error("Invalid address format");
  }

  try {
    // Try to fetch from /.well-known/ucp/identity/<address>
    const identity = await fetchIdentityFromServer(address, domain);
    identityCache.set(address, identity);
    return identity;
  } catch {
    // Fallback to DNS lookups if HTTP fails
    return fetchIdentityFromDns(address, domain);
  }
}

/**
 * Fetch identity from server endpoint
 */
async function fetchIdentityFromServer(
  address: string,
  domain: string,
): Promise<Identity> {
  // Try HTTPS first
  const urls = [
    `https://${domain}/.well-known/ucp/identity/${address}`,
    `http://${domain}/.well-known/ucp/identity/${address}`,
  ];

  let lastError: Error | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      const data = (await response.json()) as IdentityEndpointResponse;

      return {
        address: data.address,
        signingPublicKey: data.signing_key.public_key,
        signingKeyId: `${data.signing_key.created_at}`,
        dnsServerUrl: url,
        resolvedAt: Date.now(),
        expiresAt: Date.now() + 3600000, // 1 hour cache
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }

  throw lastError || new Error("Failed to fetch identity from server");
}

/**
 * Fallback: Fetch identity from DNS records
 */
async function fetchIdentityFromDns(
  address: string,
  _domain: string,
): Promise<Identity> {
  // DNS lookups for _ucp-sign, _ucp-srv, etc.
  // This would normally use DNS.resolveTxt or similar
  // For now, we'll throw to indicate DNS fallback is needed
  throw new Error(
    `DNS resolution not yet implemented. Cannot resolve ${address}`,
  );
}

/**
 * Verify that a message was signed by a specific address
 * Fetches sender's public key and verifies signature
 */
export async function verifyMessageSigner(
  message: unknown,
  signature: string,
  senderAddress: string,
): Promise<boolean> {
  try {
    const identity = await resolveIdentity(senderAddress);
    return verifySignature(message, signature, identity.signingPublicKey);
  } catch (err) {
    console.error(`Failed to verify signature from ${senderAddress}:`, err);
    return false;
  }
}

/**
 * Clear identity cache (for testing or after key rotation)
 */
export function clearIdentityCache(address?: string): void {
  if (address) {
    identityCache.delete(address);
  } else {
    identityCache.clear();
  }
}

/**
 * Get cached identity without fetching
 */
export function getCachedIdentity(address: string): Identity | null {
  const cached = identityCache.get(address);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }
  return null;
}

/**
 * Pre-fetch and cache a batch of identities
 */
export async function prefetchIdentities(
  addresses: string[],
): Promise<Map<string, Identity>> {
  const results = new Map<string, Identity>();

  await Promise.all(
    addresses.map(async (addr) => {
      try {
        const identity = await resolveIdentity(addr);
        results.set(addr, identity);
      } catch (err) {
        console.warn(`Failed to prefetch identity for ${addr}:`, err);
      }
    }),
  );

  return results;
}
