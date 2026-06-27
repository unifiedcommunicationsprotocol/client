/**
 * UCP Client MLS Group Management
 * RFC 9420 Message Layer Security implementation
 * Phase 2 implementation pending
 */

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
  cipherSuite: string; // "MLS10_128_DHKEMP1024_AES128GCM_SHA256_P256"
  createdAt: number;
  expiresAt: number;
}

/**
 * Create a new MLS group for a thread
 * TODO: Implement in Phase 2
 */
export async function createGroup(
  _groupId: string,
  _threadId: string,
  _members: string[],
): Promise<MLSGroup> {
  throw new Error("MLS group creation not yet implemented (Phase 2)");
}

/**
 * Encrypt a message to an MLS group
 * TODO: Implement in Phase 2
 */
export async function encryptMessage(
  _groupId: string,
  _message: unknown,
): Promise<string> {
  throw new Error("MLS encryption not yet implemented (Phase 2)");
}

/**
 * Decrypt a message from an MLS group
 * TODO: Implement in Phase 2
 */
export async function decryptMessage(
  _groupId: string,
  _ciphertext: string,
): Promise<unknown> {
  throw new Error("MLS decryption not yet implemented (Phase 2)");
}

/**
 * Add a member to a group (creates Add proposal)
 * TODO: Implement in Phase 2
 */
export async function addMember(
  _groupId: string,
  _address: string,
): Promise<void> {
  throw new Error("MLS add member not yet implemented (Phase 2)");
}

/**
 * Remove a member from a group (creates Remove proposal)
 * TODO: Implement in Phase 2
 */
export async function removeMember(
  _groupId: string,
  _address: string,
): Promise<void> {
  throw new Error("MLS remove member not yet implemented (Phase 2)");
}

/**
 * Get current group state
 * TODO: Implement in Phase 2
 */
export async function getGroupState(_groupId: string): Promise<MLSGroup> {
  throw new Error("MLS group state not yet implemented (Phase 2)");
}

/**
 * Publish a KeyPackage for receiving adds from others
 * TODO: Implement in Phase 2
 */
export async function publishKeyPackage(
  _address: string,
): Promise<MLSKeyPackage> {
  throw new Error("MLS key package publication not yet implemented (Phase 2)");
}
