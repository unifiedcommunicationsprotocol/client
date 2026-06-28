export function EmailBridgeSettings() {
  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "var(--r-t1)",
          margin: "0 0 24px 0",
        }}
      >
        Email Bridge
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px",
        }}
      >
        {["Gmail", "Fastmail", "IMAP"].map((provider) => (
          <div
            key={provider}
            style={{
              backgroundColor: "var(--r-sf)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--r-bd)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              {provider === "Gmail"
                ? "📧"
                : provider === "Fastmail"
                  ? "⚡"
                  : "🔧"}
            </div>
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--r-t1)",
                margin: "0 0 12px 0",
              }}
            >
              {provider}
            </h3>
            <button
              type="button"
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "600",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "var(--r-acc)",
                color: "white",
                cursor: "pointer",
              }}
            >
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* TODO: Add connected accounts display */}
    </div>
  );
}
