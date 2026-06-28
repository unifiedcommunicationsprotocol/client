import { useAppContext } from "../AppContext";
import { AppearanceSettings } from "./AppearanceSettings";
import { CalendarBridgeSettings } from "./CalendarBridgeSettings";
import { ContactsBridgeSettings } from "./ContactsBridgeSettings";
import { EmailBridgeSettings } from "./EmailBridgeSettings";
import { ExternalImagesSettings } from "./ExternalImagesSettings";
import { IdentitySettings } from "./IdentitySettings";
import { KeysSettings } from "./KeysSettings";
import { NotificationsSettings } from "./NotificationsSettings";
import { PreferencesSettings } from "./PreferencesSettings";
import { ReadReceiptsSettings } from "./ReadReceiptsSettings";
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
      case "notifications":
        return <NotificationsSettings />;
      case "preferences":
        return <PreferencesSettings />;
      case "identity":
        return <IdentitySettings />;
      case "keys":
        return <KeysSettings />;
      case "read_receipts":
        return <ReadReceiptsSettings />;
      case "ext_images":
        return <ExternalImagesSettings />;
      case "email_bridge":
        return <EmailBridgeSettings />;
      case "calendar_bridge":
        return <CalendarBridgeSettings />;
      case "contacts_bridge":
        return <ContactsBridgeSettings />;
      default:
        return <AppearanceSettings />;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar */}
      <SettingsSidebar onLogout={onLogout} />

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-[var(--r-bg)] px-11 py-9 flex justify-center">
        <div className="w-full max-w-2xl">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
