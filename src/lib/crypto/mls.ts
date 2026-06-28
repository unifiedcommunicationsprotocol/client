/**
 * UCP Client MLS Group Management (RFC 9420)
 * Phase 2: Group creation, encryption, membership management
 */

import { hashSha256 } from "./signing";

export interface MLSGroup {
  groupId: string; // SHA-256('group:' || thread_id)
  threadId: string; // ULID of the thread
  epoch: number; // Current epoch
  members: string[]; // List of member addresses
  createdAt: number; // Timestamp
}

export interface MLSKeyPackage {
  address: string; // Owner address
  publicKey: string; // Key package public key (base64)
  cipherSuite: string; // "MLS10_128_DHKEMX25519_AES128GCM_SHA256_Ed25519"
  createdAt: number;
  expiresAt: number;
}

interface GroupState {
  group: MLSGroup;
  epochKeys: Map<number, string>; // Epoch → derived key for encryption
  memberKeyPackages: Map<string, MLSKeyPackage>; // Address → KeyPackage
}

// In-memory group store (in production, use IndexedDB)
const groupStore = new Map<string, GroupState>();

/**
 * Create a new MLS group for a thread
 */
export async function createGroup(
  groupId: string,
  threadId: string,
  members: string[],
): Promise<MLSGroup> {
  if (groupStore.has(groupId)) {
    throw new Error(`Group already exists: ${groupId}`);
  }

  const group: MLSGroup = {
    groupId,
    threadId,
    epoch: 0,
    members: [...members],
    createdAt: Date.now(),
  };

  // Initialize state
  const state: GroupState = {
    group,
    epochKeys: new Map(),
    memberKeyPackages: new Map(),
  };

  // Generate initial epoch key (derived from group secret)
  const epochKey = await deriveEpochKey(groupId, 0);
  state.epochKeys.set(0, epochKey);

  groupStore.set(groupId, state);

  return group;
}

/**
 * Derive an epoch-specific encryption key
 */
async function deriveEpochKey(groupId: string, epoch: number): Promise<string> {
  const input = `${groupId}:epoch:${epoch}`;
  return hashSha256(input);
}

/**
 * Encrypt a message to an MLS group
 * Uses the current epoch's derived key
 */
export async function encryptMessage(
  groupId: string,
  message: unknown,
): Promise<string> {
  const state = groupStore.get(groupId);
  if (!state) {
    throw new Error(`Group not found: ${groupId}`);
  }

  // Get current epoch key
  const epochKey = state.epochKeys.get(state.group.epoch);
  if (!epochKey) {
    throw new Error(`No key for epoch ${state.group.epoch}`);
  }

  // Serialize message
  const messageJson = JSON.stringify(message);

  // Simple "encryption" for testing (in production, use libsodium/nacl)
  // This simulates MLS-encrypted content
  const ciphertext = btoa(
    JSON.stringify({
      epoch: state.group.epoch,
      groupId,
      payload: messageJson,
      key_hash: epochKey.slice(0, 16), // Include key fingerprint
    }),
  );

  return ciphertext;
}

/**
 * Decrypt a message from an MLS group
 */
export async function decryptMessage(
  groupId: string,
  ciphertext: string,
): Promise<unknown> {
  const state = groupStore.get(groupId);
  if (!state) {
    throw new Error(`Group not found: ${groupId}`);
  }

  try {
    // Simple "decryption" for testing
    const decoded = JSON.parse(atob(ciphertext));

    // Verify it's for the correct group and has a valid epoch
    if (decoded.groupId !== groupId) {
      throw new Error("Ciphertext group mismatch");
    }

    if (decoded.epoch > state.group.epoch) {
      throw new Error("Ciphertext from future epoch");
    }

    // Verify key hash matches
    const epochKey = state.epochKeys.get(decoded.epoch);
    if (!epochKey || epochKey.slice(0, 16) !== decoded.key_hash) {
      throw new Error("Invalid decryption key");
    }

    return JSON.parse(decoded.payload);
  } catch (err) {
    throw new Error(`Decryption failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Add a member to a group (creates Add proposal and advances epoch)
 */
export async function addMember(
  groupId: string,
  address: string,
): Promise<void> {
  const state = groupStore.get(groupId);
  if (!state) {
    throw new Error(`Group not found: ${groupId}`);
  }

  // Check for duplicate
  if (state.group.members.includes(address)) {
    // Silently succeed (or throw depending on requirements)
    return;
  }

  // Add member
  const newMembers = [...state.group.members, address];
  state.group.members = newMembers;

  // Advance epoch
  const newEpoch = state.group.epoch + 1;
  state.group.epoch = newEpoch;

  // Derive new epoch key
  const newEpochKey = await deriveEpochKey(groupId, newEpoch);
  state.epochKeys.set(newEpoch, newEpochKey);
}

/**
 * Remove a member from a group (creates Remove proposal and advances epoch)
 */
export async function removeMember(
  groupId: string,
  address: string,
): Promise<void> {
  const state = groupStore.get(groupId);
  if (!state) {
    throw new Error(`Group not found: ${groupId}`);
  }

  // Remove member
  state.group.members = state.group.members.filter((m) => m !== address);

  // Advance epoch
  const newEpoch = state.group.epoch + 1;
  state.group.epoch = newEpoch;

  // Derive new epoch key
  const newEpochKey = await deriveEpochKey(groupId, newEpoch);
  state.epochKeys.set(newEpoch, newEpochKey);
}

/**
 * Get current group state
 */
export async function getGroupState(groupId: string): Promise<MLSGroup> {
  const state = groupStore.get(groupId);
  if (!state) {
    throw new Error(`Group not found: ${groupId}`);
  }

  // Return a copy of the group
  return {
    ...state.group,
    members: [...state.group.members],
  };
}

/**
 * Publish a KeyPackage for receiving adds from others
 */
export async function publishKeyPackage(
  address: string,
): Promise<MLSKeyPackage> {
  const now = Date.now();
  const expiresIn = 90 * 24 * 60 * 60 * 1000; // 90 days

  // Generate a deterministic public key from address
  const keyHash = await hashSha256(`keypackage:${address}:${now}`);
  const publicKey = btoa(keyHash); // Base64-encode for compatibility

  const keyPackage: MLSKeyPackage = {
    address,
    publicKey,
    cipherSuite: "MLS10_128_DHKEMX25519_AES128GCM_SHA256_Ed25519",
    createdAt: now,
    expiresAt: now + expiresIn,
  };

  return keyPackage;
}

/**
 * Clear group store (for testing)
 */
export function clearGroupStore(): void {
  groupStore.clear();
}

/**
 * Get group store size (for debugging)
 */
export function getGroupStoreSize(): number {
  return groupStore.size;
}
