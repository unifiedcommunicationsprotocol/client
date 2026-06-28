import { useAppContext } from "../AppContext";
import { AppearanceSettings } from "./AppearanceSettings";
import { IdentitySettings } from "./IdentitySettings";
import { KeysSettings } from "./KeysSettings";
import { EmailBridgeSettings } from "./EmailBridgeSettings";
import { SettingsSidebar } from "./SettingsSidebar";

interface SettingsViewProps {
  onLogout: () => void;
}

export function SettingsView({ onLogout }: SettingsViewProps) {
  const { state } = useAppContext();

  const renderContent = () => {
    const section = state.settingsSection || "appearance";

    switch (section) {
      case "appearance":
        return <AppearanceSettings />;
      case "identity":
        return <IdentitySettings />;
      case "keys":
        return <KeysSettings />;
      case "email_bridge":
        return <EmailBridgeSettings />;
      default:
        return <AppearanceSettings />;
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <SettingsSidebar onLogout={onLogout} />

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "36px 44px",
          backgroundColor: "var(--r-bg)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ maxWidth: "640px", width: "100%" }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
