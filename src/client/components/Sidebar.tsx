import { useAppContext } from "../AppContext";
import { AgentsPanel } from "./AgentsPanel";
import { CalendarPanel } from "./CalendarPanel";
import { ContactsPanel } from "./ContactsPanel";
import { InboxThreadList } from "./InboxThreadList";
import { MessagesPanel } from "./MessagesPanel";
import { NotesPanel } from "./NotesPanel";

export function Sidebar() {
  const { state } = useAppContext();

  return (
    <div
      style={{
        width: "272px",
        backgroundColor: "var(--r-sf)",
        borderRight: "1px solid var(--r-bd)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Inbox Section */}
      {state.view === "inbox" && <InboxThreadList />}

      {/* Messages Section */}
      {state.view === "messaging" && <MessagesPanel />}

      {/* Calendar Section */}
      {state.view === "calendar" && <CalendarPanel />}

      {/* Contacts Section */}
      {state.view === "contacts" && <ContactsPanel />}

      {/* Notes Section */}
      {state.view === "notes" && <NotesPanel />}

      {/* Agents Section */}
      {state.view === "agents" && <AgentsPanel />}
    </div>
  );
}
