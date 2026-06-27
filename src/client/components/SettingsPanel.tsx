import { useState } from "react";

interface SettingsPanelProps {
  onLogout: () => void;
}

type SettingsCategory = "account" | "privacy" | "integrations" | "setup";

export function SettingsPanel({ onLogout }: SettingsPanelProps) {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("account");

  const categories = [
    {
      id: "account" as SettingsCategory,
      label: "ACCOUNT",
      items: [
        { id: "appearance", label: "Appearance" },
        { id: "notifications", label: "Notifications" },
        { id: "preferences", label: "Preferences" },
      ],
    },
    {
      id: "privacy" as SettingsCategory,
      label: "PRIVACY",
      items: [
        { id: "receipts", label: "Read receipts" },
        { id: "images", label: "External images" },
      ],
    },
    {
      id: "integrations" as SettingsCategory,
      label: "INTEGRATIONS",
      items: [
        { id: "email", label: "Email bridge" },
        { id: "calendar", label: "Calendar bridge" },
      ],
    },
    {
      id: "setup" as SettingsCategory,
      label: "SETUP",
      items: [{ id: "wizard", label: "Run setup wizard →" }],
    },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case "account":
        return (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>
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
                <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                  Color scheme
                </div>
                <div style={{ fontSize: "12px", color: "var(--r-t2)", marginBottom: "12px" }}>
                  Light or dark
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid var(--r-bd)",
                      backgroundColor: "var(--r-bg)",
                      color: "var(--r-t1)",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "var(--r-acc)",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Dark
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                  Thread list density
                </div>
                <div style={{ fontSize: "12px", color: "var(--r-t2)", marginBottom: "12px" }}>
                  Compact or spacious rows
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "var(--r-acc)",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Compact
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: "8px 16px",
                      borderRadius: "6px",
                      border: "1px solid var(--r-bd)",
                      backgroundColor: "var(--r-bg)",
                      color: "var(--r-t1)",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Spacious
                  </button>
                </div>
              </div>

              <div>
                <div style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}>
                  AI category badges
                </div>
                <div style={{ fontSize: "12px", color: "var(--r-t2)", marginBottom: "12px" }}>
                  Show category and source tags in thread list
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "24px",
                      backgroundColor: "var(--r-t3)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "background-color 200ms",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "24px" }}>
              {activeCategory}
            </h2>
            <div style={{ color: "var(--r-t2)" }}>Coming soon...</div>
          </div>
        );
    }
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
                onClick={() => setActiveCategory(category.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 12px",
                  fontSize: "14px",
                  border: "none",
                  backgroundColor:
                    activeCategory === category.id ? "rgba(99, 102, 241, 0.1)" : "transparent",
                  color:
                    activeCategory === category.id && item.id === "appearance"
                      ? "var(--r-acc)"
                      : "var(--r-t1)",
                  cursor: "pointer",
                  borderRadius: "6px",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--r-hov)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = activeCategory === category.id && item.id === "appearance" ? "rgba(99, 102, 241, 0.1)" : "transparent";
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
            border: "1px solid var(--r-danger)",
            backgroundColor: "transparent",
            color: "var(--r-danger)",
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
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
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
