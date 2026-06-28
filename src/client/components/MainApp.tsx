import { useAppContext } from "../AppContext";
import { CalendarView } from "./CalendarView";
import { ContactDetail } from "./ContactDetail";
import { LayoutShell } from "./LayoutShell";
import { MessagingView } from "./MessagingView";
import { NoteEditor } from "./NoteEditor";
import { SettingsPanel } from "./SettingsPanel";
import { Sidebar } from "./Sidebar";
import { ThreadDetail } from "./ThreadDetail";

interface MainAppProps {
  onLogout: () => void;
}

export function MainApp({ onLogout }: MainAppProps) {
  const { state } = useAppContext();

  // Views with secondary panels
  const showSecondary = ["inbox", "messaging", "notes", "contacts"].includes(
    state.view,
  );

  const renderMainContent = () => {
    if (state.view.startsWith("settings")) {
      return <SettingsPanel onLogout={onLogout} />;
    }

    switch (state.view) {
      case "inbox":
        return <ThreadDetail />;
      case "messaging":
        return <MessagingView />;
      case "calendar":
        return <CalendarView />;
      case "contacts":
        return <ContactDetail />;
      case "notes":
        return <NoteEditor />;
      case "agents":
        return (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--r-t2)",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "48px" }}>🤖</div>
            <div>Select an agent to view details</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <LayoutShell
      showSecondary={showSecondary}
      secondaryContent={<Sidebar />}
      mainContent={renderMainContent()}
    />
  );
}
