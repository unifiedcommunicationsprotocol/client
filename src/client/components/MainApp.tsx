import { useAppContext } from "../AppContext";
import { AgentsView } from "./AgentsView";
import { CalendarView } from "./CalendarView";
import { ContactDetail } from "./ContactDetail";
import { LayoutShell } from "./LayoutShell";
import { MessageThread } from "./MessageThread";
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
        return <MessageThread />;
      case "calendar":
        return <CalendarView />;
      case "contacts":
        return <ContactDetail />;
      case "notes":
        return <NoteEditor />;
      case "agents":
        return <AgentsView />;
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
