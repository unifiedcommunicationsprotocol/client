import { useAppContext } from "../AppContext";

interface SettingsSidebarProps {
  onLogout: () => void;
}

export function SettingsSidebar({ onLogout }: SettingsSidebarProps) {
  const { state, dispatch } = useAppContext();

  const categories = [
    {
      id: "general",
      label: "GENERAL",
      items: [
        { id: "appearance", label: "Appearance" },
        { id: "notifications", label: "Notifications" },
      ],
    },
    {
      id: "privacy",
      label: "PRIVACY & SECURITY",
      items: [
        { id: "identity", label: "Identity" },
        { id: "keys", label: "Keys" },
      ],
    },
    {
      id: "bridges",
      label: "INTEGRATIONS",
      items: [
        { id: "email_bridge", label: "Email bridge" },
        { id: "calendar_bridge", label: "Calendar bridge" },
        { id: "contacts_bridge", label: "Contacts bridge" },
      ],
    },
  ];

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "var(--r-sf)",
        borderRight: "1px solid var(--r-bd)",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Settings title */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--r-bd)",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--r-t1)",
            margin: "0",
          }}
        >
          Settings
        </h2>
      </div>

      {/* Menu items */}
      <div style={{ flex: 1, overflow: "auto", padding: "12px 0" }}>
        {categories.map((category) => (
          <div key={category.id}>
            {/* Category header */}
            <div
              style={{
                padding: "12px 20px 8px",
                fontSize: "10px",
                fontWeight: "600",
                color: "var(--r-t3)",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {category.label}
            </div>

            {/* Category items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {category.items.map((item) => {
                const isActive = state.settingsSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "setSettingsSection", payload: item.id })
                    }
                    style={{
                      padding: "8px 20px",
                      margin: "0 8px",
                      width: "calc(100% - 16px)",
                      border: "none",
                      borderRadius: "6px",
                      backgroundColor: isActive
                        ? "var(--r-sel)"
                        : "transparent",
                      color: isActive ? "var(--r-t1)" : "var(--r-t2)",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: isActive ? "500" : "400",
                      textAlign: "left",
                      transition: "background-color 150ms",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "var(--r-hov)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                      }
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid var(--r-bd)",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={onLogout}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid var(--r-bd)",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "var(--r-t2)",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
