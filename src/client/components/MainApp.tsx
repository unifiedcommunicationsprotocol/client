import { useState } from "react";
import { Inbox } from "./Inbox";
import { Sidebar } from "./Sidebar";
import { SettingsPanel } from "./SettingsPanel";

interface MainAppProps {
  onLogout: () => void;
}

type Section = "inbox" | "messaging" | "calendar" | "contacts" | "notes" | "agents" | "settings";

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
  const [activeSection, setActiveSection] = useState<Section>("inbox");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const renderSection = () => {
    switch (activeSection) {
      case "inbox":
        return <Inbox selectedThreadId={selectedThreadId} onSelectThread={setSelectedThreadId} />;
      case "messaging":
        return <div style={{ padding: "20px", color: "var(--r-t2)" }}>Messaging (coming soon)</div>;
      case "calendar":
        return <div style={{ padding: "20px", color: "var(--r-t2)" }}>Calendar (coming soon)</div>;
      case "contacts":
        return <div style={{ padding: "20px", color: "var(--r-t2)" }}>Contacts (coming soon)</div>;
      case "notes":
        return <div style={{ padding: "20px", color: "var(--r-t2)" }}>Notes (coming soon)</div>;
      case "agents":
        return <div style={{ padding: "20px", color: "var(--r-t2)" }}>Agents (coming soon)</div>;
      case "settings":
        return <SettingsPanel onLogout={onLogout} />;
      default:
        return null;
    }
  };

  const navItems = [
    { icon: Icons.inbox, label: "Inbox", id: "inbox" as Section },
    { icon: Icons.messages, label: "Messages", id: "messaging" as Section },
    { icon: Icons.calendar, label: "Calendar", id: "calendar" as Section },
    { icon: Icons.contacts, label: "Contacts", id: "contacts" as Section },
    { icon: Icons.notes, label: "Notes", id: "notes" as Section },
    { icon: Icons.agents, label: "Agents", id: "agents" as Section },
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
            onClick={() => {
              setActiveSection(item.id);
              setSelectedThreadId(null);
            }}
            title={item.label}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "6px",
              border: "none",
              backgroundColor:
                activeSection === item.id ? "rgba(99, 102, 241, 0.15)" : "transparent",
              color: activeSection === item.id ? "#6366F1" : "rgba(255,255,255,0.42)",
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
          onClick={() => setActiveSection("settings")}
          title="Settings"
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "6px",
            border: "none",
            backgroundColor:
              activeSection === "settings" ? "rgba(99, 102, 241, 0.15)" : "transparent",
            color: activeSection === "settings" ? "#6366F1" : "rgba(255,255,255,0.42)",
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
        <div
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
          }}
          title="Account"
        >
          Y
        </div>
      </nav>

      {/* Content Area */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        <Sidebar activeSection={activeSection} />

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
