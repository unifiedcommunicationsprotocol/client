import { useAppContext } from "../AppContext";

export function ContactsBridgeSettings() {
  const { state, dispatch } = useAppContext();

  const providers = [
    { id: "google", name: "Google Contacts", icon: "G", color: "#EA4335" },
    { id: "fastmail", name: "Fastmail Contacts", icon: "F", color: "#1C6EF2" },
    { id: "carddav", name: "Any CardDAV source", icon: "⇆", color: "#666666" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "4px",
            color: "var(--r-t1)",
          }}
        >
          Contacts (CardDAV)
        </h2>
        <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
          Sync contacts from external address books via CardDAV. Contacts appear
          in your Relay directory and autocomplete.
        </p>
      </div>

      {/* Connected contacts */}
      {state.settingsCardAccounts.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--r-t1)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Connected
          </h3>
          {state.settingsCardAccounts.map((account) => (
            <div
              key={account.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px",
                borderRadius: "6px",
                background: "var(--r-sf)",
                border: "1px solid var(--r-bd)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "4px",
                    background:
                      account.provider === "google"
                        ? "#EA4335"
                        : account.provider === "fastmail"
                          ? "#1C6EF2"
                          : "#666666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {account.provider === "google"
                    ? "G"
                    : account.provider === "fastmail"
                      ? "F"
                      : "⇆"}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--r-t1)",
                    }}
                  >
                    {account.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--r-t3)" }}>
                    Syncing · {account.email} · {account.lastSync}
                  </div>
                </div>
              </div>
              <button
                type="button"
                style={{
                  padding: "6px 12px",
                  borderRadius: "5px",
                  border: "none",
                  background: "transparent",
                  color: "#EF4444",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 120ms",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add contacts section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--r-t1)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {state.settingsCardAccounts.length > 0
            ? "Connect another"
            : "Connect an address book"}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}
        >
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => {
                dispatch({
                  type: "setBridgeOauthProvider",
                  payload: provider.id,
                });
                dispatch({ type: "setBridgeOauthStep", payload: "info" });
                dispatch({ type: "setBridgeAccountType", payload: "carddav" });
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "20px",
                borderRadius: "6px",
                background: "var(--r-sf)",
                border: "1px solid var(--r-bd)",
                cursor: "pointer",
                transition: "all 120ms",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--r-acc)";
                e.currentTarget.style.background = "var(--r-accd)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--r-bd)";
                e.currentTarget.style.background = "var(--r-sf)";
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  background: provider.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {provider.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--r-t1)",
                  }}
                >
                  {provider.name}
                </div>
                <div style={{ fontSize: "11px", color: "var(--r-acc)" }}>
                  Connect →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div
        style={{
          padding: "12px",
          borderRadius: "6px",
          background: "var(--r-sf)",
          border: "1px solid var(--r-bd)",
          fontSize: "13px",
          color: "var(--r-t2)",
          lineHeight: "1.5",
        }}
      >
        Synced contacts are read-only by default. CardDAV write sync can be
        enabled per address book. Contacts from external sources are marked with
        their origin.
      </div>
    </div>
  );
}
