import { useAppContext } from "../AppContext";
import { ThreadView } from "./ThreadView";
import { MessagingView } from "./MessagingView";
import { CalendarView } from "./CalendarView";
import { ContactDetail } from "./ContactDetail";
import { NoteEditor } from "./NoteEditor";
import { Sidebar } from "./Sidebar";
import { SettingsPanel } from "./SettingsPanel";
import { UserMenu } from "./UserMenu";

interface MainAppProps {
  onLogout: () => void;
}

const Icons = {
  relay: (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <title>Relay</title>
      <path
        d="M1 5.5h14M10 1l5 4.5L10 10"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  inbox: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Inbox</title>
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 6l6.5 3.5L14.5 6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  messages: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Messages</title>
      <path
        d="M13.5 8.5c0 2.761-2.462 5-5.5 5a5.9 5.9 0 01-2.692-.643L2 14l1.143-2.857A4.88 4.88 0 012 8.5c0-2.761 2.462-5 5.5-5s5.5 2.239 5.5 5z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Calendar</title>
      <rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 7h13M5 1.5v3M11 1.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  contacts: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Contacts</title>
      <circle cx="8" cy="6" r="2.75" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2 13.5c0-2.485 2.686-4.5 6-4.5s6 2.015 6 4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  ),
  notes: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Notes</title>
      <path d="M4 1.5h5.5L13 5v9.5H4V1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 9h4M6.5 11.5h2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  agents: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <title>Agents</title>
      <path
        d="M5.5 11L8 3l2.5 8M3.5 8h9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="13" r="1.25" fill="currentColor" />
    </svg>
  ),
  compose: (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <title>Compose</title>
      <path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

export function MainApp({ onLogout }: MainAppProps) {
  const { state, dispatch } = useAppContext();

  const renderSection = () => {
    if (state.view.startsWith("settings")) {
      return <SettingsPanel onLogout={onLogout} />;
    }

    switch (state.view) {
      case "inbox":
        return <ThreadView />;
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

  const navItems = [
    { icon: Icons.inbox, label: "Inbox", id: "inbox" },
    { icon: Icons.messages, label: "Messages", id: "messaging" },
    { icon: Icons.calendar, label: "Calendar", id: "calendar" },
    { icon: Icons.contacts, label: "Contacts", id: "contacts" },
    { icon: Icons.notes, label: "Notes", id: "notes" },
    { icon: Icons.agents, label: "Agents", id: "agents" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--r-bg)",
      }}
    >
      {/* Left Navigation */}
      <nav
        style={{
          width: "52px",
          backgroundColor: "#0A0A0D",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px 6px",
          gap: "2px",
          overflowY: "auto",
          flexShrink: 0,
        }}
      >
        {/* Relay Logo */}
        <button
          type="button"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#6366F1",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            marginBottom: "12px",
            flexShrink: 0,
          }}
          title="Relay"
        >
          {Icons.relay}
        </button>

        {/* Navigation Items */}
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => dispatch({ type: "setView", payload: item.id })}
            title={item.label}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              border: "none",
              backgroundColor:
                state.view === item.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
              color: state.view === item.id ? "#6366F1" : "rgba(255,255,255,0.42)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 100ms, color 100ms",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {item.icon}
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Settings Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: "setView", payload: "settings/appearance" })}
          title="Settings"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "6px",
            border: "none",
            backgroundColor:
              state.view.startsWith("settings") ? "rgba(99, 102, 241, 0.15)" : "transparent",
            color: state.view.startsWith("settings") ? "#6366F1" : "rgba(255,255,255,0.42)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 100ms, color 100ms",
            position: "relative",
            flexShrink: 0,
            marginBottom: "4px",
          }}
        >
          ⚙️
        </button>

        {/* User Avatar */}
        <button
          type="button"
          onClick={() => dispatch({ type: "setShowUserMenu", payload: !state.showUserMenu })}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            backgroundColor: "#4F46E5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: "700",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease",
            flexShrink: 0,
            userSelect: "none",
            border: "none",
            padding: 0,
          }}
          title="Account"
        >
          Y
        </button>
        {state.showUserMenu && <UserMenu onLogout={onLogout} />}
      </nav>

      {/* Content Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderLeft: "1px solid var(--r-bd)",
          }}
        >
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
