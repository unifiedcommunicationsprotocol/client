/**
 * Onboarding Step 3: Connect to UCP Server
 */

import { useState } from "react";
import { createAppTransport } from "@/lib/appTransport";
import { signMessage } from "@/lib/crypto/signing";
import { useAppContext } from "../AppContext";
import { Icon } from "./Icon";

export interface OnboardingConnectProps {
  onComplete: (step: number) => void;
  serverUrl?: string;
}

export const OnboardingConnect = ({
  onComplete,
  serverUrl = "ws://localhost:3001",
}: OnboardingConnectProps) => {
  const { state, dispatch } = useAppContext();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    setChallenge(null);

    try {
      if (!state.signingKeyPublic || !state.signingKeySecret) {
        throw new Error("Signing key not found. Please complete Step 1.");
      }

      // Generate auth token (32 random bytes, base64)
      // In real scenario, this would come from server's identity endpoint
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      const authToken = Buffer.from(tokenBytes).toString("base64");

      // Store auth token
      dispatch({
        type: "setTransportAuthToken",
        payload: authToken,
      });

      // Create app transport with state callbacks
      const transport = createAppTransport(
        {
          serverUrl,
          authToken,
          clientId: state.transportAuthToken || "client-001",
        },
        (transportState) => {
          if (transportState.isConnected) {
            dispatch({
              type: "setTransportConnected",
              payload: true,
            });
            dispatch({
              type: "setTransportError",
              payload: null,
            });
          } else if (transportState.error) {
            dispatch({
              type: "setTransportError",
              payload: transportState.error,
            });
          }

          dispatch({
            type: "setTransportConnecting",
            payload: transportState.isConnecting,
          });

          dispatch({
            type: "setTransportReconnectAttempt",
            payload: transportState.reconnectAttempt,
          });
        },
      );

      // Attempt connection
      await transport.connect();

      // If we got here, handshake succeeded and we received a challenge
      const serverChallenge = transport.getChallenge();
      if (serverChallenge) {
        setChallenge(serverChallenge);

        // Sign the challenge with our signing key for final auth
        try {
          const signature = await signMessage(
            serverChallenge,
            state.signingKeySecret,
          );

          // In real flow, we'd send this signature back to server
          // For now, just verify it locally
          console.log(`Challenge signed: ${signature.slice(0, 16)}...`);
        } catch (err) {
          console.error("Failed to sign challenge:", err);
        }
      }

      // We're connected! Move to next step
      setTimeout(() => onComplete(3), 500);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsConnecting(false);
    }
  };

  const isReady =
    state.signingKeyPublic && state.signingKeySecret && !isConnecting;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h3
          style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}
        >
          Connect to UCP Server
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "13px",
            color: "var(--r-t2)",
            lineHeight: "1.5",
          }}
        >
          Your signing key will be used to authenticate with the server and sign
          messages.
        </p>
      </div>

      {/* Server URL */}
      <div>
        <div
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "500",
            marginBottom: "6px",
            color: "var(--r-t2)",
          }}
        >
          Server URL
        </div>
        <div
          style={{
            padding: "8px 10px",
            fontSize: "13px",
            fontFamily: "'Space Mono', monospace",
            backgroundColor: "var(--r-sf)",
            borderRadius: "6px",
            color: "var(--r-t1)",
            wordBreak: "break-all",
          }}
        >
          {serverUrl}
        </div>
      </div>

      {/* Status */}
      {state.transportConnecting && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            border: "1px solid var(--r-acc)",
            borderRadius: "6px",
            color: "var(--r-acc)",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon name="calendar" size={14} />
          Connecting to server...
          {state.transportReconnectAttempt > 0 &&
            ` (attempt ${state.transportReconnectAttempt})`}
        </div>
      )}

      {state.transportConnected && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            border: "1px solid var(--r-safe)",
            borderRadius: "6px",
            color: "var(--r-safe)",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon name="check" size={14} />
          Connected to server!
          {challenge && (
            <div style={{ marginTop: "8px", fontSize: "11px" }}>
              Challenge: {challenge.slice(0, 16)}...
            </div>
          )}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--r-danger)",
            borderRadius: "6px",
            color: "var(--r-danger)",
            fontSize: "13px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Icon name="close" size={14} />
          {error.message}
        </div>
      )}

      {/* Connect Button */}
      <button
        type="button"
        className="primary"
        onClick={handleConnect}
        disabled={!isReady}
        style={{
          padding: "10px 16px",
          fontSize: "14px",
          fontWeight: "500",
          cursor: isReady ? "pointer" : "not-allowed",
          opacity: isReady ? 1 : 0.5,
        }}
      >
        {isConnecting ? "Connecting..." : "Connect to Server"}
      </button>

      {/* Address Display */}
      {state.transportAuthToken && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "var(--r-sf)",
            borderRadius: "6px",
            fontSize: "12px",
            color: "var(--r-t2)",
          }}
        >
          <div style={{ marginBottom: "4px", color: "var(--r-t3)" }}>
            Address
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              color: "var(--r-t1)",
            }}
          >
            {state.transportAuthToken}
          </div>
        </div>
      )}
    </div>
  );
};
