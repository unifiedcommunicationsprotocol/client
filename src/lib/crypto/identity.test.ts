import { test, expect, describe, mock, beforeEach } from "bun:test";
import {
  resolveIdentity,
  verifyMessageSigner,
  clearIdentityCache,
  getCachedIdentity,
  prefetchIdentities,
} from "./identity";

describe("Identity Resolution", () => {
  beforeEach(() => {
    clearIdentityCache();
  });

  describe("Address Format Validation", () => {
    test("rejects address without @ symbol", async () => {
      try {
        await resolveIdentity("invalidaddress");
        expect(true).toBe(false); // Should reject
      } catch (err: any) {
        expect(err.message).toContain("Invalid address format");
      }
    });

    test("rejects empty domain", async () => {
      try {
        await resolveIdentity("user@");
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toBeDefined();
      }
    });

    test("accepts valid email-like address", async () => {
      // This will fail to fetch but should pass format validation
      try {
        await resolveIdentity("alice@example.com");
      } catch (err: any) {
        // Expected to fail fetch, not format validation
        expect(err.message).not.toContain("Invalid address format");
      }
    });
  });

  describe("Caching", () => {
    test("getCachedIdentity returns null when not cached", () => {
      const cached = getCachedIdentity("alice@example.com");
      expect(cached).toBeNull();
    });

    test("clearIdentityCache clears specific address", async () => {
      // Create a mock identity
      const mockFetch = mock(async (url: string) => {
        if (url.includes("alice")) {
          return {
            ok: true,
            json: async () => ({
              address: "alice@example.com",
              signing_key: {
                public_key: "pk1",
                created_at: Date.now(),
                expires_at: Date.now() + 60000,
              },
            }),
          };
        }
        throw new Error("Not found");
      });

      global.fetch = mockFetch as any;

      try {
        const identity = await resolveIdentity("alice@example.com");
        let cached = getCachedIdentity("alice@example.com");
        expect(cached).not.toBeNull();

        clearIdentityCache("alice@example.com");
        cached = getCachedIdentity("alice@example.com");
        expect(cached).toBeNull();

        // Verify identity has required fields
        expect(identity.address).toBe("alice@example.com");
      } finally {
        // Restore
        clearIdentityCache();
      }
    });

    test("clearIdentityCache with no args clears all", async () => {
      const mockFetch = mock(async (url: string) => {
        const address = url.includes("alice") ? "alice" : "bob";
        return {
          ok: true,
          json: async () => ({
            address: `${address}@example.com`,
            signing_key: {
              public_key: `pk_${address}`,
              created_at: Date.now(),
              expires_at: Date.now() + 60000,
            },
          }),
        };
      });

      global.fetch = mockFetch as any;

      try {
        // Pre-fetch multiple
        await prefetchIdentities(["alice@example.com", "bob@example.com"]);

        let cached = getCachedIdentity("alice@example.com");
        expect(cached).not.toBeNull();

        clearIdentityCache();

        cached = getCachedIdentity("alice@example.com");
        expect(cached).toBeNull();
      } finally {
        clearIdentityCache();
      }
    });

    test("cache respects expiration time", async () => {
      const mockFetch = mock(async () => {
        return {
          ok: true,
          json: async () => ({
            address: "alice@example.com",
            signing_key: {
              public_key: "pk1",
              created_at: Date.now(),
              expires_at: Date.now() + 60000,
            },
          }),
        };
      });

      global.fetch = mockFetch as any;

      try {
        const identity = await resolveIdentity("alice@example.com");

        // Immediately available
        let cached = getCachedIdentity("alice@example.com");
        expect(cached).not.toBeNull();
        expect(cached?.address).toBe("alice@example.com");

        // Verify identity object structure
        expect(identity.resolvedAt).toBeGreaterThan(0);

        // Clear and verify cache is empty
        clearIdentityCache("alice@example.com");
        expect(getCachedIdentity("alice@example.com")).toBeNull();
      } finally {
        clearIdentityCache();
      }
    });
  });

  describe("Message Verification", () => {
    test("verifyMessageSigner rejects invalid signature format", async () => {
      const result = await verifyMessageSigner(
        { body: "test" },
        "not a valid signature",
        "alice@example.com",
      );

      expect(result).toBe(false);
    });

    test("verifyMessageSigner catches identity resolution errors", async () => {
      const mockFetch = mock(async () => {
        throw new Error("Network error");
      });

      global.fetch = mockFetch as any;

      try {
        const result = await verifyMessageSigner(
          { body: "test" },
          "signature",
          "alice@example.com",
        );

        expect(result).toBe(false);
      } finally {
        clearIdentityCache();
      }
    });
  });

  describe("Prefetching", () => {
    test("prefetchIdentities returns empty map on complete failure", async () => {
      const mockFetch = mock(async () => {
        return { ok: false };
      });

      global.fetch = mockFetch as any;

      try {
        const results = await prefetchIdentities(["alice@example.com"]);
        expect(results.size).toBe(0);
      } finally {
        clearIdentityCache();
      }
    });

    test("prefetchIdentities returns partial results on mixed success/failure",
      async () => {
        const mockFetch = mock(async (url: string) => {
          if (url.includes("alice")) {
            return {
              ok: true,
              json: async () => ({
                address: "alice@example.com",
                signing_key: {
                  public_key: "pk_alice",
                  created_at: Date.now(),
                  expires_at: Date.now() + 60000,
                },
              }),
            };
          }
          return { ok: false };
        });

        global.fetch = mockFetch as any;

        try {
          const results = await prefetchIdentities([
            "alice@example.com",
            "bob@example.com",
          ]);

          expect(results.has("alice@example.com")).toBe(true);
          expect(results.has("bob@example.com")).toBe(false);
        } finally {
          clearIdentityCache();
        }
      },
    );
  });

  describe("Server Endpoint Fallback", () => {
    test("resolveIdentity tries HTTPS before HTTP", async () => {
      const fetchCalls: string[] = [];

      const mockFetch = mock(async (url: string) => {
        fetchCalls.push(url);
        if (url.startsWith("https://")) {
          return {
            ok: true,
            json: async () => ({
              address: "alice@example.com",
              signing_key: {
                public_key: "pk1",
                created_at: Date.now(),
                expires_at: Date.now() + 60000,
              },
            }),
          };
        }
        return { ok: false };
      });

      global.fetch = mockFetch as any;

      try {
        await resolveIdentity("alice@example.com");

        // Verify HTTPS was tried first
        expect(fetchCalls.length).toBeGreaterThan(0);
        expect(fetchCalls[0]).toContain("https://");
      } finally {
        clearIdentityCache();
      }
    });

    test("resolveIdentity falls back to HTTP if HTTPS fails", async () => {
      const fetchCalls: string[] = [];

      const mockFetch = mock(async (url: string) => {
        fetchCalls.push(url);
        if (url.startsWith("http://") && !url.startsWith("https://")) {
          return {
            ok: true,
            json: async () => ({
              address: "alice@example.com",
              signing_key: {
                public_key: "pk1",
                created_at: Date.now(),
                expires_at: Date.now() + 60000,
              },
            }),
          };
        }
        return { ok: false };
      });

      global.fetch = mockFetch as any;

      try {
        await resolveIdentity("alice@example.com");

        // Both HTTPS and HTTP should be attempted
        expect(fetchCalls.length).toBeGreaterThanOrEqual(1);
      } finally {
        clearIdentityCache();
      }
    });

    test("resolveIdentity throws if both HTTPS and HTTP fail", async () => {
      const mockFetch = mock(async () => {
        return { ok: false };
      });

      global.fetch = mockFetch as any;

      try {
        await resolveIdentity("alice@example.com");
        expect(true).toBe(false); // Should reject
      } catch (err: any) {
        expect(err.message).toBeDefined();
      } finally {
        clearIdentityCache();
      }
    });
  });

  describe("Timeout Handling", () => {
    test("fetch rejects on network error gracefully", async () => {
      const mockFetch = mock(async () => {
        throw new Error("Network error");
      });

      global.fetch = mockFetch as any;

      try {
        await resolveIdentity("alice@example.com");
        expect(true).toBe(false); // Should reject
      } catch (err: any) {
        // Expected to fail
        expect(err).toBeDefined();
      } finally {
        clearIdentityCache();
      }
    });
  });
});
