import { test, expect, describe } from "bun:test";
import { createEnvelope, parseEnvelope } from "./api";

describe("Message Envelope Serialization", () => {
  describe("Envelope Creation", () => {
    test("createEnvelope constructs valid envelope", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "base64encryptedcontent",
        signature: "base64signature",
      });

      expect(envelope.from).toBe("alice@example.com");
      expect(envelope.to).toEqual(["bob@example.com"]);
      expect(envelope.message_ciphertext).toBe("base64encryptedcontent");
      expect(envelope.signature).toBe("base64signature");
      expect(envelope.sent_at).toBeGreaterThan(0);
    });

    test("createEnvelope includes message_id", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(envelope.message_id).toBeDefined();
      expect(envelope.message_id.length).toBeGreaterThan(0);
    });

    test("createEnvelope includes all headers", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        cc: ["charlie@example.com"],
        bcc: ["dave@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(envelope.from).toBe("alice@example.com");
      expect(envelope.to).toEqual(["bob@example.com"]);
      expect(envelope.cc).toEqual(["charlie@example.com"]);
      expect(envelope.bcc).toEqual(["dave@example.com"]);
    });

    test("createEnvelope handles optional headers", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(envelope.cc).toBeUndefined();
      expect(envelope.bcc).toBeUndefined();
      expect(envelope.subject).toBeUndefined();
    });

    test("createEnvelope serializes to JSON", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      const json = JSON.stringify(envelope);
      expect(json).toContain("alice@example.com");
      expect(json).toContain("ciphertext");
    });
  });

  describe("Envelope Parsing", () => {
    test("parseEnvelope deserializes valid envelope", () => {
      const envelopeJson = JSON.stringify({
        message_id: "msg_123",
        from: "alice@example.com",
        to: ["bob@example.com"],
        sent_at: 1234567890,
        message_ciphertext: "ciphertext",
        signature: "signature",
      });

      const envelope = parseEnvelope(envelopeJson);

      expect(envelope.message_id).toBe("msg_123");
      expect(envelope.from).toBe("alice@example.com");
      expect(envelope.to).toEqual(["bob@example.com"]);
      expect(envelope.message_ciphertext).toBe("ciphertext");
      expect(envelope.signature).toBe("signature");
    });

    test("parseEnvelope rejects invalid JSON", () => {
      expect(() => {
        parseEnvelope("not valid json");
      }).toThrow();
    });

    test("parseEnvelope rejects missing required fields", () => {
      const incompleteJson = JSON.stringify({
        message_id: "msg_123",
        from: "alice@example.com",
        // missing 'to', 'message_ciphertext', 'signature'
      });

      expect(() => {
        parseEnvelope(incompleteJson);
      }).toThrow();
    });

    test("parseEnvelope handles optional fields", () => {
      const envelopeJson = JSON.stringify({
        message_id: "msg_123",
        from: "alice@example.com",
        to: ["bob@example.com"],
        cc: ["charlie@example.com"],
        sent_at: 1234567890,
        message_ciphertext: "ciphertext",
        signature: "signature",
      });

      const envelope = parseEnvelope(envelopeJson);

      expect(envelope.cc).toEqual(["charlie@example.com"]);
    });

    test("parseEnvelope validates 'to' is array", () => {
      const invalidJson = JSON.stringify({
        message_id: "msg_123",
        from: "alice@example.com",
        to: "bob@example.com", // Should be array
        message_ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(() => {
        parseEnvelope(invalidJson);
      }).toThrow();
    });
  });

  describe("Round-trip Serialization", () => {
    test("envelope survives create → serialize → parse", () => {
      const original = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        cc: ["charlie@example.com"],
        messageContent: { body: "test" },
        ciphertext: "abc123",
        signature: "xyz789",
      });

      const serialized = JSON.stringify(original);
      const parsed = parseEnvelope(serialized);

      expect(parsed.from).toBe(original.from);
      expect(parsed.to).toEqual(original.to);
      expect(parsed.cc).toEqual(original.cc);
      expect(parsed.message_ciphertext).toBe(original.message_ciphertext);
      expect(parsed.signature).toBe(original.signature);
    });

    test("envelope with multiple recipients", () => {
      const original = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com", "charlie@example.com"],
        cc: ["dave@example.com", "eve@example.com"],
        messageContent: { subject: "Meeting" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      const serialized = JSON.stringify(original);
      const parsed = parseEnvelope(serialized);

      expect(parsed.to.length).toBe(2);
      expect(parsed.cc?.length).toBe(2);
    });
  });

  describe("Headers", () => {
    test("envelope includes subject when provided", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        subject: "Hello World",
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(envelope.subject).toBe("Hello World");
    });

    test("envelope preserves all address fields", () => {
      const envelope = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        cc: ["charlie@example.com"],
        bcc: ["dave@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(envelope.from).toBe("alice@example.com");
      expect(envelope.to).toEqual(["bob@example.com"]);
      expect(envelope.cc).toEqual(["charlie@example.com"]);
      expect(envelope.bcc).toEqual(["dave@example.com"]);
    });

    test("envelope timestamp is always set", () => {
      const envelope1 = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      const envelope2 = createEnvelope({
        from: "alice@example.com",
        to: ["bob@example.com"],
        messageContent: { body: "hello" },
        ciphertext: "ciphertext",
        signature: "signature",
      });

      expect(envelope1.sent_at).toBeGreaterThan(0);
      expect(envelope2.sent_at).toBeGreaterThan(0);
      // Later envelope should have later or equal timestamp
      expect(envelope2.sent_at).toBeGreaterThanOrEqual(envelope1.sent_at);
    });
  });
});
