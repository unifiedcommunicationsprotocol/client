/**
 * Onboarding Step 2: Claim UCP Address
 */

import { useState } from "react";
import { useAppContext } from "../AppContext";

export interface OnboardingAddressProps {
  onComplete: (step: number) => void;
}

export const OnboardingAddress = ({ onComplete }: OnboardingAddressProps) => {
  const { dispatch } = useAppContext();
  const [useRelay, setUseRelay] = useState(true);
  const [username, setUsername] = useState("");
  const [domain, setDomain] = useState("relay.im");
  const [error, setError] = useState<string | null>(null);

  const validateAddress = () => {
    if (!username.trim()) {
      setError("Username required");
      return false;
    }

    if (!/^[a-z0-9._-]+$/.test(username)) {
      setError("Username can only contain a-z, 0-9, ., _, -");
      return false;
    }

    if (!useRelay && !domain.trim()) {
      setError("Domain required");
      return false;
    }

    if (!useRelay && !/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
      setError("Invalid domain format");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    setError(null);

    if (!validateAddress()) {
      return;
    }

    const finalDomain = useRelay ? "relay.im" : domain;
    const address = `${username}@${finalDomain}`;

    // Store address in AppContext (we'll use this for transport config later)
    dispatch({
      type: "setTransportAuthToken",
      payload: address, // Temporary: use as placeholder for Step 3
    });

    onComplete(2);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h3
          style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}
        >
          Choose Your Address
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "13px",
            color: "var(--r-t2)",
            lineHeight: "1.5",
          }}
        >
          Pick a UCP address (username@domain). You can use relay.im or bring
          your own domain.
        </p>
      </div>

      {/* Relay vs BYOD Toggle */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={() => setUseRelay(true)}
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: "13px",
            fontWeight: "500",
            border: `2px solid ${useRelay ? "var(--r-acc)" : "var(--r-bd)"}`,
            backgroundColor: useRelay ? "rgba(99,102,241,0.1)" : "transparent",
            color: useRelay ? "var(--r-acc)" : "var(--r-t2)",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          relay.im
        </button>
        <button
          type="button"
          onClick={() => setUseRelay(false)}
          style={{
            flex: 1,
            padding: "10px 12px",
            fontSize: "13px",
            fontWeight: "500",
            border: `2px solid ${!useRelay ? "var(--r-acc)" : "var(--r-bd)"}`,
            backgroundColor: !useRelay ? "rgba(99,102,241,0.1)" : "transparent",
            color: !useRelay ? "var(--r-acc)" : "var(--r-t2)",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Bring Your Domain
        </button>
      </div>

      {/* Username Input */}
      <div>
        <label
          style={{
            display: "block",
            fontSize: "12px",
            fontWeight: "500",
            marginBottom: "6px",
            color: "var(--r-t2)",
          }}
        >
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.toLowerCase())}
          placeholder="alice"
          style={{
            width: "100%",
            padding: "8px 10px",
            fontSize: "13px",
            border: "1px solid var(--r-bd)",
            borderRadius: "6px",
            backgroundColor: "var(--r-sf)",
            color: "var(--r-t1)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Domain Input (BYOD only) */}
      {!useRelay && (
        <div>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: "500",
              marginBottom: "6px",
              color: "var(--r-t2)",
            }}
          >
            Domain
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value.toLowerCase())}
            placeholder="example.com"
            style={{
              width: "100%",
              padding: "8px 10px",
              fontSize: "13px",
              border: "1px solid var(--r-bd)",
              borderRadius: "6px",
              backgroundColor: "var(--r-sf)",
              color: "var(--r-t1)",
              boxSizing: "border-box",
            }}
          />
          <p
            style={{
              margin: "6px 0 0 0",
              fontSize: "11px",
              color: "var(--r-t3)",
            }}
          >
            You'll need to publish DNS records for identity verification.
          </p>
        </div>
      )}

      {/* Preview */}
      <div
        style={{
          padding: "10px",
          backgroundColor: "var(--r-sf)",
          borderRadius: "6px",
          fontSize: "12px",
          fontFamily: "'Space Mono', monospace",
          color: "var(--r-t2)",
        }}
      >
        {username || "[username]"}@
        {useRelay ? "relay.im" : domain || "[domain]"}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid var(--r-danger)",
            borderRadius: "6px",
            color: "var(--r-danger)",
            fontSize: "12px",
          }}
        >
          {error}
        </div>
      )}

      {/* Next Button */}
      <button
        type="button"
        className="primary"
        onClick={handleNext}
        style={{
          padding: "10px 16px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Next: Connect Server
      </button>
    </div>
  );
};
