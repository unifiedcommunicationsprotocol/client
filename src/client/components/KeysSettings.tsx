import { useAppContext } from "../AppContext";

export function KeysSettings() {
  const { dispatch } = useAppContext();

  const keysets = [
    {
      id: "ks-primary",
      name: "Primary Key",
      created: "2026-01-15",
      rotation: "2026-04-15",
      status: "active",
      fingerprint: "6366F1A2B3C4D5E6F7G8H9I0J1K2L3M4",
    },
    {
      id: "ks-secondary",
      name: "Secondary Key",
      created: "2025-10-20",
      rotation: "2026-01-20",
      status: "retired",
      fingerprint: "0EA5E9F2G3H4I5J6K7L8M9N0O1P2Q3R4",
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "var(--r-t1)",
            margin: "0",
          }}
        >
          Keys
        </h1>
        <button
          type="button"
          onClick={() => dispatch({ type: "setKeygenStep", payload: 1 })}
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "600",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "var(--r-acc)",
            color: "white",
            cursor: "pointer",
          }}
        >
          + New keyset
        </button>
      </div>

      {/* Keysets */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginBottom: "32px",
        }}
      >
        {keysets.map((keyset) => (
          <div
            key={keyset.id}
            style={{
              backgroundColor: "var(--r-sf)",
              padding: "20px",
              borderRadius: "8px",
              border:
                keyset.status === "active"
                  ? "1px solid #6366F1"
                  : "1px solid var(--r-bd)",
            }}
          >
            {/* Header with status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor:
                    keyset.status === "active" ? "#22C55E" : "#9CA3AF",
                }}
              />
              <h3
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--r-t1)",
                  margin: "0",
                  flex: 1,
                }}
              >
                {keyset.name}
              </h3>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  color: keyset.status === "active" ? "#22C55E" : "#9CA3AF",
                  textTransform: "capitalize",
                }}
              >
                {keyset.status}
              </span>
            </div>

            {/* Fingerprint */}
            <div
              style={{
                backgroundColor: "var(--r-bg)",
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "'Space Mono', monospace",
                color: "var(--r-t3)",
                marginBottom: "12px",
                wordBreak: "break-all",
              }}
            >
              {keyset.fingerprint}
            </div>

            {/* Details */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--r-t3)",
                    marginBottom: "4px",
                  }}
                >
                  Created
                </div>
                <div style={{ fontSize: "12px", color: "var(--r-t1)" }}>
                  {keyset.created}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--r-t3)",
                    marginBottom: "4px",
                  }}
                >
                  Rotation date
                </div>
                <div style={{ fontSize: "12px", color: "var(--r-t1)" }}>
                  {keyset.rotation}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
              {keyset.status !== "active" && (
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "500",
                    border: "1px solid var(--r-acc)",
                    borderRadius: "4px",
                    backgroundColor: "transparent",
                    color: "var(--r-acc)",
                    cursor: "pointer",
                  }}
                >
                  Use this
                </button>
              )}
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  border: "1px solid var(--r-bd)",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  color: "var(--r-t1)",
                  cursor: "pointer",
                }}
              >
                Rotate
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  border: "1px solid var(--r-bd)",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  color: "#EF4444",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div
        style={{
          backgroundColor: "#EF4444",
          opacity: 0.1,
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #EF4444",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#EF4444",
            marginBottom: "8px",
          }}
        >
          Danger Zone
        </div>
        <button
          type="button"
          style={{
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "600",
            border: "1px solid #EF4444",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#EF4444",
            cursor: "pointer",
          }}
        >
          Revoke identity...
        </button>
      </div>
    </div>
  );
}
