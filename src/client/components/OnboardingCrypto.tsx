/**
 * Onboarding Step 1: Cryptographic Identity Generation
 */

import { useState } from "react";
import { generateSigningKey } from "@/lib/crypto/signing";
import { useAppContext } from "../AppContext";

export interface OnboardingCryptoProps {
  onComplete: (step: number) => void;
}

export const OnboardingCrypto = ({ onComplete }: OnboardingCryptoProps) => {
  const { dispatch } = useAppContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<{
    publicKey: string;
    secretKey: string;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const handleGenerateKeys = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const key = await generateSigningKey();
      const publicKey = key.publicKey;
      const secretKey = key.secretKey;

      setGeneratedKey({ publicKey, secretKey });

      // Store in AppContext
      dispatch({
        type: "setSigningKey",
        payload: { publicKey, secretKey },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (generatedKey) {
      onComplete(1);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h3
          style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}
        >
          Generate Your Signing Key
        </h3>
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "13px",
            color: "var(--r-t2)",
            lineHeight: "1.5",
          }}
        >
          Your signing key is used to authenticate with the UCP server and sign
          messages. Keep your secret key safe.
        </p>
      </div>

      {!generatedKey ? (
        <button
          type="button"
          className="primary"
          onClick={handleGenerateKeys}
          disabled={isGenerating}
          style={{
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: isGenerating ? "not-allowed" : "pointer",
            opacity: isGenerating ? 0.6 : 1,
          }}
        >
          {isGenerating ? "Generating..." : "Generate Signing Key"}
        </button>
      ) : (
        <>
          <div
            style={{
              padding: "12px",
              backgroundColor: "var(--r-sf)",
              borderRadius: "6px",
            }}
          >
            <div style={{ marginBottom: "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "var(--r-t3)",
                  marginBottom: "4px",
                }}
              >
                Public Key (Share this)
              </div>
              <code
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontFamily: "'Space Mono', monospace",
                  color: "var(--r-safe)",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap",
                  userSelect: "all",
                }}
              >
                {generatedKey.publicKey.slice(0, 32)}...
              </code>
            </div>

            <div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: "var(--r-t3)",
                  marginBottom: "4px",
                }}
              >
                Secret Key (Keep this private!)
              </div>
              <code
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontFamily: "'Space Mono', monospace",
                  color: "var(--r-danger)",
                  wordBreak: "break-all",
                  whiteSpace: "pre-wrap",
                  userSelect: "all",
                }}
              >
                {generatedKey.secretKey.slice(0, 32)}...
              </code>
            </div>
          </div>

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
            Next: Claim Address
          </button>
        </>
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
          }}
        >
          {error.message}
        </div>
      )}
    </div>
  );
};
