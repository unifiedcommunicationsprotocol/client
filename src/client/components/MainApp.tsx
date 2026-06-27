import { useState } from "react";
import { Inbox } from "./Inbox";
import { Sidebar } from "./Sidebar";
import { SettingsPanel } from "./SettingsPanel";

interface MainAppProps {
  onLogout: () => void;
}

type Section = "inbox" | "messaging" | "calendar" | "contacts" | "notes" | "agents" | "settings";

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
    { icon: "📧", label: "Inbox", id: "inbox" as Section },
    { icon: "💬", label: "Messages", id: "messaging" as Section },
    { icon: "📅", label: "Calendar", id: "calendar" as Section },
    { icon: "👥", label: "Contacts", id: "contacts" as Section },
    { icon: "📝", label: "Notes", id: "notes" as Section },
    { icon: "🤖", label: "Agents", id: "agents" as Section },
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
          borderRight: "1px solid var(--r-bd)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "12px",
          paddingBottom: "12px",
          gap: "8px",
          overflowY: "auto",
        }}
      >
        {/* Relay Logo */}
        <button
          type="button"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "var(--r-acc)",
            color: "white",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            marginBottom: "8px",
          }}
          title="Relay"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 12px rgba(99, 102, 241, 0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          🔐
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
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeSection === item.id ? "rgba(99, 102, 241, 0.2)" : "transparent",
              color: activeSection === item.id ? "var(--r-acc)" : "var(--r-t2)",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
              borderLeft:
                activeSection === item.id ? "3px solid var(--r-acc)" : "3px solid transparent",
              paddingRight: "3px",
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
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeSection === "settings" ? "rgba(99, 102, 241, 0.2)" : "transparent",
            color: activeSection === "settings" ? "var(--r-acc)" : "var(--r-t2)",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
            borderLeft:
              activeSection === "settings" ? "3px solid var(--r-acc)" : "3px solid transparent",
            paddingRight: "3px",
            marginBottom: "4px",
          }}
        >
          ⚙️
        </button>

        {/* User Avatar */}
        <button
          type="button"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            backgroundColor: "#6366F1",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            fontWeight: "600",
            color: "white",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          title="User menu"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          Y
        </button>
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
