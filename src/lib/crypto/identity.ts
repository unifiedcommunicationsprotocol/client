/**
 * UCP Client Identity Resolution (Functional)
 * Handles DNS lookups and key verification
 */

import { verifySignature } from "./signing";

export interface Identity {
  address: string;
  signingPublicKey: string;
  signingKeyId: string;
  identityPublicKey?: string;
  dnsServerUrl?: string;
  resolvedAt: number;
  expiresAt: number;
}

interface IdentityEndpointResponse {
  address: string;
  signing_key: {
    public_key: string;
    created_at: number;
    expires_at: number;
    identity_sig?: string;
  };
  server_key?: {
    public_key: string;
    created_at: number;
  };
}

// Immutable cache as a Map (frozen at module level)
const createIdentityCache = () => new Map<string, Identity>();

let identityCache = createIdentityCache();

/**
 * Fetch identity from server endpoint
 */
const fetchIdentityFromServer = async (
  address: string,
  domain: string,
): Promise<Identity> => {
  const urls = [
    `https://${domain}/.well-known/ucp/identity/${address}`,
    `http://${domain}/.well-known/ucp/identity/${address}`,
  ];

  let lastError: Error | null = null;

  const fetchUrl = async (url: string): Promise<Identity | null> => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as IdentityEndpointResponse;

      return {
        address: data.address,
        signingPublicKey: data.signing_key.public_key,
        signingKeyId: `${data.signing_key.created_at}`,
        dnsServerUrl: url,
        resolvedAt: Date.now(),
        expiresAt: Date.now() + 3600000,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      return null;
    }
  };

  for (const url of urls) {
    const result = await fetchUrl(url);
    if (result) return result;
  }

  throw lastError || new Error("Failed to fetch identity from server");
};

/**
 * Fallback: Fetch identity from DNS records
 */
const fetchIdentityFromDns = async (
  address: string,
  _domain: string,
): Promise<Identity> => {
  throw new Error(
    `DNS resolution not yet implemented. Cannot resolve ${address}`,
  );
};

/**
 * Resolve a UCP address to get signing keys
 */
export const resolveIdentity = async (address: string): Promise<Identity> => {
  const cached = identityCache.get(address);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }

  const [, domain] = address.split("@");
  if (!domain) {
    throw new Error("Invalid address format");
  }

  try {
    const identity = await fetchIdentityFromServer(address, domain);
    identityCache = new Map(identityCache).set(address, identity);
    return identity;
  } catch {
    return fetchIdentityFromDns(address, domain);
  }
};

/**
 * Verify that a message was signed by a specific address
 */
export const verifyMessageSigner = async (
  message: unknown,
  signature: string,
  senderAddress: string,
): Promise<boolean> => {
  try {
    const identity = await resolveIdentity(senderAddress);
    return verifySignature(message, signature, identity.signingPublicKey);
  } catch (err) {
    console.error(`Failed to verify signature from ${senderAddress}:`, err);
    return false;
  }
};

/**
 * Clear identity cache
 */
export const clearIdentityCache = (address?: string): void => {
  if (address) {
    const newCache = new Map(identityCache);
    newCache.delete(address);
    identityCache = newCache;
  } else {
    identityCache = createIdentityCache();
  }
};

/**
 * Get cached identity without fetching
 */
export const getCachedIdentity = (address: string): Identity | null => {
  const cached = identityCache.get(address);
  if (cached && cached.expiresAt > Date.now()) {
    return cached;
  }
  return null;
};

/**
 * Pre-fetch and cache a batch of identities
 */
export const prefetchIdentities = async (
  addresses: string[],
): Promise<Map<string, Identity>> => {
  const results = new Map<string, Identity>();

  const results_ = await Promise.all(
    addresses.map(async (addr) => {
      try {
        const identity = await resolveIdentity(addr);
        return [addr, identity] as const;
      } catch (err) {
        console.warn(`Failed to prefetch identity for ${addr}:`, err);
        return null;
      }
    }),
  );

  return results_.reduce((acc, item) => {
    if (item) {
      acc.set(item[0], item[1]);
    }
    return acc;
  }, results);
};
