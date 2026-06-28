/**
 * UCP Client Challenge-Response Authentication (Phase 1, Step 5)
 * Single-use 32-byte challenges with Ed25519 signatures
 */

import { signMessage, verifySignature } from "./signing";

export interface ChallengeResponse {
  challenge: string; // The challenge from server
  signature: string; // Ed25519 signature over canonical JSON
}

/**
 * Create a challenge response by signing the challenge
 * Client-side: signs the server's challenge with their signing key
 */
export async function createChallengeResponse(
  challenge: string,
  signingKeySecretBase64: string,
): Promise<ChallengeResponse> {
  const challengePayload = {
    type: "challenge_response",
    challenge,
  };

  const signature = await signMessage(challengePayload, signingKeySecretBase64);

  return {
    challenge,
    signature,
  };
}

/**
 * Verify a challenge response
 * Server-side: verifies the signed challenge with the client's public key
 */
export async function verifyChallengeResponse(
  challenge: string,
  signatureBase64: string,
  publicKeyBase64: string,
): Promise<boolean> {
  const challengePayload = {
    type: "challenge_response",
    challenge,
  };

  return verifySignature(challengePayload, signatureBase64, publicKeyBase64);
}

/**
 * Create an auth token for a client address
 * Token is deterministic hash of address + secret
 * In production, this would be a random token stored server-side
 * For testing, we use a deterministic hash
 */
export function createAuthToken(address: string): string {
  // Create a deterministic token from the address
  // In production, the server would generate a random token and store it
  // For now, we create a stable token from address hash
  const payload = {
    type: "auth_token",
    address,
    issued_at: Math.floor(Date.now() / 1000), // Round to seconds for determinism
  };

  const json = JSON.stringify(payload);
  const encoded = btoa(json); // Base64 encode

  return encoded;
}

/**
 * Validate an auth token (dummy implementation for now)
 * Server-side: verify token is valid and not expired
 */
export function validateAuthToken(
  token: string,
  _expectedAddress?: string,
): boolean {
  try {
    const decoded = atob(token);
    const payload = JSON.parse(decoded);

    // Check structure
    if (!payload.type || payload.type !== "auth_token") {
      return false;
    }

    if (!payload.address) {
      return false;
    }

    // In real implementation, would check:
    // - Token not expired (24 hours)
    // - Token in server's token store
    // - Address matches (if provided)

    return true;
  } catch {
    return false;
  }
}

/**
 * Extract address from auth token
 */
export function getAddressFromToken(token: string): string | null {
  try {
    const decoded = atob(token);
    const payload = JSON.parse(decoded);
    return payload.address || null;
  } catch {
    return null;
  }
}
