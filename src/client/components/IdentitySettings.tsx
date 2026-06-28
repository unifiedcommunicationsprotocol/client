export function IdentitySettings() {
  const ucpAddress = "alice@relay.im";
  const displayName = "Alice Johnson";

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
        Identity
      </h1>

      {/* UCP Address */}
      <div
        style={{
          backgroundColor: "var(--r-sf)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--r-t2)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          UCP Address
        </div>
        <div
          style={{
            backgroundColor: "var(--r-bg)",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid var(--r-bd)",
            fontSize: "14px",
            fontFamily: "'Space Mono', monospace",
            color: "var(--r-t1)",
          }}
        >
          {ucpAddress}
        </div>
      </div>

      {/* Display Name */}
      <div
        style={{
          backgroundColor: "var(--r-sf)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
          marginBottom: "24px",
        }}
      >
        <label
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--r-t2)",
            textTransform: "uppercase",
            display: "block",
            marginBottom: "12px",
          }}
        >
          Display Name
        </label>
        <input
          type="text"
          defaultValue={displayName}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "14px",
            border: "1px solid var(--r-bd)",
            borderRadius: "6px",
            backgroundColor: "var(--r-bg)",
            color: "var(--r-t1)",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Active Keyset */}
      <div
        style={{
          backgroundColor: "var(--r-sf)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--r-t2)",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Active Keyset
        </div>
        <div
          style={{
            backgroundColor: "var(--r-bg)",
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #6366F1",
            fontSize: "13px",
            color: "var(--r-t1)",
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "8px" }}>Primary Key</div>
          <div style={{ fontSize: "11px", color: "var(--r-t3)", marginBottom: "8px" }}>
            Created: 2026-01-15
          </div>
          <button
            type="button"
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: "var(--r-acc)",
              color: "white",
              cursor: "pointer",
            }}
          >
            Manage keys →
          </button>
        </div>
      </div>
    </div>
  );
}
