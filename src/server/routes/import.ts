import { Hono } from "hono";
import { importEmailsFromBridge } from "../../lib/imap";
import type { Messaging } from "../../lib/messaging";

/**
 * Email import endpoints
 * Handle OAuth callbacks and email import workflows
 */
export function createImportRoutes(messaging: Messaging) {
  const routes = new Hono();

  /**
   * POST /import/oauth/callback
   * Handle OAuth callback from Gmail/Fastmail
   *
   * Request: { provider: "gmail"|"fastmail", code: "...", state: "..." }
   * Response: { success: true, imported: number, errors: [...] }
   */
  routes.post("/oauth/callback", async (c) => {
    try {
      const body = await c.req.json();
      const { provider, code } = body;

      if (!provider || !code) {
        return c.json(
          { error: "provider and code required" },
          { status: 400 }
        );
      }

      if (!["gmail", "fastmail"].includes(provider)) {
        return c.json(
          { error: "provider must be gmail or fastmail" },
          { status: 400 }
        );
      }

      console.log(
        `[Import] OAuth callback: ${provider} with code ${code.substring(0, 10)}...`
      );

      // In production: Exchange code for access token via OAuth provider
      // For now, use code as token for testing
      const accessToken = code;

      // Import emails
      const result = await importEmailsFromBridge(
        provider as "gmail" | "fastmail",
        accessToken,
        messaging
      );

      return c.json(
        {
          success: true,
          provider,
          imported: result.imported,
          failed: result.failed,
          errors: result.errors,
        },
        { status: 201 }
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[Import] OAuth callback error:", message);
      return c.json({ error: message }, { status: 500 });
    }
  });

  /**
   * GET /import/status
   * Check import status for a provider
   */
  routes.get("/status", async (c) => {
    const provider = c.req.query("provider");

    if (!provider || !["gmail", "fastmail"].includes(provider)) {
      return c.json({ error: "Invalid provider" }, { status: 400 });
    }

    return c.json({
      provider,
      status: "ready",
      lastImport: null,
      nextImport: new Date(Date.now() + 3600000), // 1 hour from now
    });
  });

  /**
   * POST /import/manual
   * Manually trigger import for a provider
   *
   * Request: { provider: "gmail"|"fastmail", access_token: "..." }
   */
  routes.post("/manual", async (c) => {
    try {
      const body = await c.req.json();
      const { provider, access_token } = body;

      if (!provider || !access_token) {
        return c.json(
          { error: "provider and access_token required" },
          { status: 400 }
        );
      }

      console.log(`[Import] Manual import requested for ${provider}`);

      const result = await importEmailsFromBridge(
        provider as "gmail" | "fastmail",
        access_token,
        messaging
      );

      return c.json({
        success: true,
        ...result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[Import] Manual import error:", message);
      return c.json({ error: message }, { status: 500 });
    }
  });

  return routes;
}

export default createImportRoutes;
