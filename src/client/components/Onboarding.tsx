import { useState } from "react";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [identityKey, setIdentityKey] = useState("");
  const [signingKey, setSigningKey] = useState("");
  const [address, setAddress] = useState("");
  const [domain, setDomain] = useState("relay.im");
  const [useOwnDomain, setUseOwnDomain] = useState(false);

  const steps = [
    {
      title: "Your cryptographic identity",
      description: "UCP uses Ed25519 keypairs for identity. Your identity key stays offline.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div
              style={{ display: "block", marginBottom: "8px", fontWeight: "500", fontSize: "14px" }}
            >
              Generate Identity Key
            </div>
            <button
              className="primary"
              onClick={() => {
                setIdentityKey(`ik_${Math.random().toString(36).substr(2, 32)}`);
                setSigningKey(`sk_${Math.random().toString(36).substr(2, 32)}`);
              }}
              type="button"
            >
              Generate Keys
            </button>
            {identityKey && (
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "var(--r-sf)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "'Space Mono', monospace",
                  color: "var(--r-t2)",
                  wordBreak: "break-all",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <div style={{ fontSize: "11px", color: "var(--r-t3)", marginBottom: "4px" }}>
                    Identity Key (back up offline)
                  </div>
                  {identityKey}
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "var(--r-t3)", marginBottom: "4px" }}>
                    Signing Key (device)
                  </div>
                  {signingKey}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Claim your address",
      description: "Choose a relay.im address or bring your own domain.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input type="radio" checked={!useOwnDomain} onChange={() => setUseOwnDomain(false)} />
              Use relay.im address
            </label>
          </div>

          {!useOwnDomain ? (
            <div>
              <label
                htmlFor="address-input"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Username
              </label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  id="address-input"
                  type="text"
                  placeholder="alice"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ flex: 1 }}
                />
                <span style={{ padding: "10px 12px", color: "var(--r-t2)" }}>@relay.im</span>
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="domain-input"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
              >
                Your Domain
              </label>
              <input
                id="domain-input"
                type="text"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                style={{ width: "100%" }}
              />
              <p style={{ fontSize: "13px", color: "var(--r-t3)", marginTop: "8px" }}>
                Publish DNS records for identity verification
              </p>
            </div>
          )}

          <div>
            <label
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <input type="radio" checked={useOwnDomain} onChange={() => setUseOwnDomain(true)} />
              Use my own domain
            </label>
          </div>
        </div>
      ),
    },
    {
      title: "Connect existing email",
      description: "Bridge Gmail, Fastmail, or other accounts. Messages arrive encrypted.",
      content: (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button className="primary" style={{ width: "100%" }}>
            <span style={{ marginRight: "8px" }}>📧</span> Connect Gmail
          </button>
          <button className="secondary" style={{ width: "100%" }}>
            <span style={{ marginRight: "8px" }}>📬</span> Connect Fastmail
          </button>
          <button className="secondary" style={{ width: "100%" }}>
            <span style={{ marginRight: "8px" }}>✉️</span> Connect Other Email
          </button>
          <p
            style={{
              fontSize: "13px",
              color: "var(--r-t3)",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            Existing emails are encrypted and stored locally. Bridge is read-only for v1.0.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: "20px",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "var(--r-bg)",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          padding: "40px",
          animation: "fadeUp 0.3s ease",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>🔐 Relay</div>
          <div
            style={{
              fontSize: "13px",
              color: "var(--r-acc)",
              fontWeight: "600",
              marginBottom: "16px",
            }}
          >
            STEP {step + 1} OF {steps.length}
          </div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--r-t1)",
              marginBottom: "8px",
            }}
          >
            {steps[step]?.title}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--r-t2)" }}>{steps[step]?.description}</p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "4px",
                backgroundColor: i <= step ? "var(--r-acc)" : "var(--r-bd)",
                borderRadius: "2px",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ marginBottom: "32px" }}>{steps[step]?.content}</div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="secondary"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            style={{ flex: 1 }}
          >
            Back
          </button>
          <button
            className="primary"
            onClick={() => {
              if (step === steps.length - 1) {
                onComplete();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={step === 0 && !identityKey}
            style={{ flex: 1 }}
          >
            {step === steps.length - 1 ? "Done" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
