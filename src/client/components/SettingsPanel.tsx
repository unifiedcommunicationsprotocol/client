import { useAppContext } from "../AppContext";

interface SettingsPanelProps {
  onLogout: () => void;
}

export function SettingsPanel({ onLogout }: SettingsPanelProps) {
  const { state, dispatch } = useAppContext();

  const categories = [
    {
      id: "account",
      label: "ACCOUNT",
      items: [
        { id: "appearance", label: "Appearance" },
        { id: "notifications", label: "Notifications" },
        { id: "preferences", label: "Preferences" },
      ],
    },
    {
      id: "privacy",
      label: "PRIVACY",
      items: [
        { id: "read_receipts", label: "Read receipts" },
        { id: "external_images", label: "External images" },
      ],
    },
    {
      id: "integrations",
      label: "INTEGRATIONS",
      items: [
        { id: "email_bridge", label: "Email bridge" },
        { id: "calendar_bridge", label: "Calendar bridge" },
        { id: "card_bridge", label: "Contacts bridge" },
      ],
    },
    {
      id: "setup",
      label: "SETUP",
      items: [{ id: "wizard", label: "Run setup wizard →" }],
    },
  ];

  const getSettingTitle = () => {
    for (const cat of categories) {
      for (const item of cat.items) {
        if (state.view === `settings/${item.id}`) {
          return item.label;
        }
      }
    }
    return "Appearance";
  };

  const renderContent = () => {
    if (state.view.startsWith("settings/appearance")) {
      return (
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px",
              color: "var(--r-t1)",
            }}
          >
            Appearance
          </h2>
          <div
            style={{
              backgroundColor: "var(--r-sf)",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid var(--r-bd)",
            }}
          >
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "var(--r-t1)",
                }}
              >
                Color scheme
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--r-t2)",
                  marginBottom: "12px",
                }}
              >
                Light or dark
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => {
                    if (state.darkMode) {
                      dispatch({ type: "toggleDarkMode" });
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: state.darkMode ? "1px solid var(--r-bd)" : "none",
                    backgroundColor: state.darkMode
                      ? "var(--r-bg)"
                      : "var(--r-acc)",
                    color: state.darkMode ? "var(--r-t1)" : "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!state.darkMode) {
                      dispatch({ type: "toggleDarkMode" });
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: !state.darkMode ? "1px solid var(--r-bd)" : "none",
                    backgroundColor: !state.darkMode
                      ? "var(--r-bg)"
                      : "var(--r-acc)",
                    color: !state.darkMode ? "var(--r-t1)" : "white",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Dark
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  marginBottom: "8px",
                  color: "var(--r-t1)",
                }}
              >
                Thread list density
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--r-t2)",
                  marginBottom: "12px",
                }}
              >
                Compact or spacious rows
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "setVariant", payload: "A" })}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border:
                      state.variant === "A" ? "none" : "1px solid var(--r-bd)",
                    backgroundColor:
                      state.variant === "A" ? "var(--r-acc)" : "var(--r-bg)",
                    color: state.variant === "A" ? "white" : "var(--r-t1)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Compact
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "setVariant", payload: "B" })}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border:
                      state.variant === "B" ? "none" : "1px solid var(--r-bd)",
                    backgroundColor:
                      state.variant === "B" ? "var(--r-acc)" : "var(--r-bg)",
                    color: state.variant === "B" ? "white" : "var(--r-t1)",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Spacious
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            marginBottom: "24px",
            color: "var(--r-t1)",
          }}
        >
          {getSettingTitle()}
        </h2>
        <div style={{ color: "var(--r-t2)" }}>Coming soon...</div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Settings Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "var(--r-sf)",
          borderRight: "1px solid var(--r-bd)",
          padding: "20px 12px",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        {categories.map((category) => (
          <div key={category.id}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "var(--r-t3)",
                textTransform: "uppercase",
                paddingLeft: "12px",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              {category.label}
            </div>
            {category.items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() =>
                  dispatch({ type: "setView", payload: `settings/${item.id}` })
                }
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: "14px",
                  border: "none",
                  backgroundColor:
                    state.view === `settings/${item.id}`
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                  color:
                    state.view === `settings/${item.id}`
                      ? "var(--r-acc)"
                      : "var(--r-t1)",
                  cursor: "pointer",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (state.view !== `settings/${item.id}`) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--r-hov)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (state.view !== `settings/${item.id}`) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "24px",
            borderRadius: "6px",
            border: "1px solid #EF4444",
            backgroundColor: "transparent",
            color: "#EF4444",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          Logout
        </button>
      </div>

      {/* Settings Content */}
      <div
        style={{
          flex: 1,
          padding: "24px",
          overflowY: "auto",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
