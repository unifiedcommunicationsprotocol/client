import { useAppContext } from "../AppContext";
import { AgentsPanel } from "./AgentsPanel";
import { CalendarPanel } from "./CalendarPanel";
import { ChannelList } from "./ChannelList";
import { ContactsPanel } from "./ContactsPanel";
import { InboxThreadList } from "./InboxThreadList";
import { NotesPanel } from "./NotesPanel";

export function Sidebar() {
  const { state } = useAppContext();

  return (
    <div className="w-68 bg-[var(--r-sf)] border-r border-[var(--r-bd)] flex flex-col overflow-hidden">
      {/* Inbox Section */}
      {state.view === "inbox" && <InboxThreadList />}

      {/* Messages Section */}
      {state.view === "messaging" && <ChannelList />}

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
