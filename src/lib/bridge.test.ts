import { test, expect, describe } from "bun:test";
import {
  createAuthorizationUrl,
  exchangeAuthorizationCode,
  refreshAccessToken,
  validateBridgeAccount,
  revokeBridgeAccount,
  BRIDGE_PROVIDERS,
  type BridgeAccount,
} from "./bridge";

describe("Bridge Integration", () => {
  describe("Provider Configuration", () => {
    test("BRIDGE_PROVIDERS includes gmail", () => {
      expect(BRIDGE_PROVIDERS.gmail).toBeDefined();
      expect(BRIDGE_PROVIDERS.gmail.name).toBe("gmail");
      expect(BRIDGE_PROVIDERS.gmail.scopes).toContain(
        "https://www.googleapis.com/auth/gmail.readonly",
      );
    });

    test("BRIDGE_PROVIDERS includes fastmail", () => {
      expect(BRIDGE_PROVIDERS.fastmail).toBeDefined();
      expect(BRIDGE_PROVIDERS.fastmail.name).toBe("fastmail");
    });

    test("BRIDGE_PROVIDERS includes generic", () => {
      expect(BRIDGE_PROVIDERS.generic).toBeDefined();
      expect(BRIDGE_PROVIDERS.generic.name).toBe("generic");
    });
  });

  describe("OAuth Authorization URL", () => {
    test("createAuthorizationUrl generates valid URL for Gmail", () => {
      const url = createAuthorizationUrl(
        "gmail",
        "client_123",
        "http://localhost:3000/callback",
        "state_abc",
      );

      expect(url).toContain("https://accounts.google.com/o/oauth2/v2/auth");
      expect(url).toContain("client_id=client_123");
      expect(url).toContain("redirect_uri=");
      expect(url).toContain("state=state_abc");
      expect(url).toContain("gmail.readonly");
    });

    test("createAuthorizationUrl includes scopes", () => {
      const url = createAuthorizationUrl(
        "gmail",
        "client_id",
        "http://localhost:3000/callback",
        "state",
      );

      expect(url).toContain("scope=");
      const scopes = BRIDGE_PROVIDERS.gmail.scopes;
      scopes.forEach((scope) => {
        expect(url).toContain(encodeURIComponent(scope));
      });
    });

    test("createAuthorizationUrl throws for unknown provider", () => {
      expect(() => {
        createAuthorizationUrl(
          "unknown",
          "client_id",
          "http://localhost/callback",
          "state",
        );
      }).toThrow();
    });

    test("createAuthorizationUrl works for all providers", () => {
      for (const [providerName] of Object.entries(BRIDGE_PROVIDERS)) {
        const url = createAuthorizationUrl(
          providerName,
          "client_id",
          "http://localhost/callback",
          "state_123",
        );

        expect(url).toBeDefined();
        expect(url.length).toBeGreaterThan(0);
        expect(url).toContain("client_id=client_id");
      }
    });
  });

  describe("OAuth Token Exchange", () => {
    test("exchangeAuthorizationCode throws on network error", async () => {
      try {
        await exchangeAuthorizationCode(
          "gmail",
          "invalid_code",
          "client_id",
          "client_secret",
          "http://localhost/callback",
        );
        expect(true).toBe(false); // Should reject
      } catch (err: any) {
        expect(err.message).toContain("failed");
      }
    });

    test("exchangeAuthorizationCode throws for unknown provider", async () => {
      try {
        await exchangeAuthorizationCode(
          "unknown",
          "code",
          "client_id",
          "secret",
          "http://localhost/callback",
        );
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toContain("Unknown");
      }
    });
  });

  describe("Token Refresh", () => {
    test("refreshAccessToken throws for unknown provider", async () => {
      try {
        await refreshAccessToken(
          "unknown",
          "refresh_token",
          "client_id",
          "client_secret",
        );
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toContain("Unknown");
      }
    });

    test("refreshAccessToken throws on network error", async () => {
      try {
        await refreshAccessToken(
          "gmail",
          "invalid_token",
          "client_id",
          "client_secret",
        );
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toContain("failed");
      }
    });
  });

  describe("Bridge Account Validation", () => {
    test("validateBridgeAccount returns false for missing token", async () => {
      const account: BridgeAccount = {
        id: "acc_1",
        provider: "gmail",
        email: "user@gmail.com",
        accessToken: "",
        createdAt: Date.now(),
      };

      const valid = await validateBridgeAccount(account);
      expect(valid).toBe(false);
    });

    test("validateBridgeAccount returns false for expired token", async () => {
      const account: BridgeAccount = {
        id: "acc_1",
        provider: "gmail",
        email: "user@gmail.com",
        accessToken: "token_123",
        expiresAt: Date.now() - 1000, // Expired 1 second ago
        createdAt: Date.now() - 86400000,
      };

      const valid = await validateBridgeAccount(account);
      expect(valid).toBe(false);
    });

    test("validateBridgeAccount returns true for valid account", async () => {
      const account: BridgeAccount = {
        id: "acc_1",
        provider: "gmail",
        email: "user@gmail.com",
        accessToken: "token_123",
        expiresAt: Date.now() + 86400000, // Expires in 1 day
        createdAt: Date.now(),
      };

      const valid = await validateBridgeAccount(account);
      expect(valid).toBe(true);
    });

    test("validateBridgeAccount returns true for account without expiry", async () => {
      const account: BridgeAccount = {
        id: "acc_1",
        provider: "gmail",
        email: "user@gmail.com",
        accessToken: "token_123",
        createdAt: Date.now(),
      };

      const valid = await validateBridgeAccount(account);
      expect(valid).toBe(true);
    });
  });

  describe("Account Revocation", () => {
    test("revokeBridgeAccount throws for missing provider", async () => {
      try {
        await revokeBridgeAccount("", "refresh_token");
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toContain("Invalid");
      }
    });

    test("revokeBridgeAccount throws for missing refresh token", async () => {
      try {
        await revokeBridgeAccount("gmail", "");
        expect(true).toBe(false);
      } catch (err: any) {
        expect(err.message).toContain("Invalid");
      }
    });

    test("revokeBridgeAccount succeeds with valid parameters", async () => {
      // Should not throw
      await expect(
        revokeBridgeAccount("gmail", "refresh_token_123"),
      ).resolves.toBeUndefined();
    });
  });

  describe("Bridge Account Lifecycle", () => {
    test("full OAuth flow: authorization → token exchange → validation", async () => {
      // Step 1: Generate authorization URL
      const authUrl = createAuthorizationUrl(
        "gmail",
        "client_id_123",
        "http://localhost:3000/callback",
        "state_xyz",
      );

      expect(authUrl).toContain("client_id=client_id_123");
      expect(authUrl).toContain("state=state_xyz");

      // Step 2: (In real flow, user logs in at authUrl, gets authorization code)
      // Step 3: Would exchange code for token (skipped due to network)

      // Step 4: Create account with sample token
      const account: BridgeAccount = {
        id: "acc_oauth",
        provider: "gmail",
        email: "user@gmail.com",
        accessToken: "access_token_123",
        refreshToken: "refresh_token_123",
        expiresAt: Date.now() + 3600000,
        createdAt: Date.now(),
      };

      // Step 5: Validate account
      const valid = await validateBridgeAccount(account);
      expect(valid).toBe(true);
    });
  });

  describe("Multiple Bridge Accounts", () => {
    test("different providers can coexist", () => {
      const gmailUrl = createAuthorizationUrl(
        "gmail",
        "gmail_client",
        "http://localhost/callback",
        "state_1",
      );

      const fastmailUrl = createAuthorizationUrl(
        "fastmail",
        "fastmail_client",
        "http://localhost/callback",
        "state_2",
      );

      expect(gmailUrl).not.toBe(fastmailUrl);
      expect(gmailUrl).toContain("google");
      expect(fastmailUrl).toContain("fastmail");
    });

    test("validate multiple accounts", async () => {
      const gmailAccount: BridgeAccount = {
        id: "acc_gmail",
        provider: "gmail",
        email: "user@gmail.com",
        accessToken: "token_g",
        expiresAt: Date.now() + 86400000,
        createdAt: Date.now(),
      };

      const fastmailAccount: BridgeAccount = {
        id: "acc_fastmail",
        provider: "fastmail",
        email: "user@fastmail.com",
        accessToken: "token_f",
        expiresAt: Date.now() + 86400000,
        createdAt: Date.now(),
      };

      const validGmail = await validateBridgeAccount(gmailAccount);
      const validFastmail = await validateBridgeAccount(fastmailAccount);

      expect(validGmail).toBe(true);
      expect(validFastmail).toBe(true);
    });
  });
});
