import { useState } from "react";
import { Inbox } from "./Inbox";
import { Sidebar } from "./Sidebar";

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
        return (
          <div style={{ padding: "20px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px" }}>Settings</h2>
            <button className="primary" onClick={onLogout}>
              Logout
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "var(--r-bg)",
      }}
    >
      {/* Icon Navigation */}
      <nav
        style={{
          width: "60px",
          backgroundColor: "var(--r-sf)",
          borderRight: "1px solid var(--r-bd)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 0",
          gap: "8px",
          overflowY: "auto",
        }}
      >
        {[
          { icon: "📧", label: "Inbox", id: "inbox" as Section },
          { icon: "💬", label: "Messaging", id: "messaging" as Section },
          { icon: "📅", label: "Calendar", id: "calendar" as Section },
          { icon: "👥", label: "Contacts", id: "contacts" as Section },
          { icon: "📝", label: "Notes", id: "notes" as Section },
          { icon: "🤖", label: "Agents", id: "agents" as Section },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              setSelectedThreadId(null);
            }}
            title={item.label}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: activeSection === item.id ? "var(--r-acc)" : "transparent",
              color: activeSection === item.id ? "white" : "var(--r-t2)",
              fontSize: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
          >
            {item.icon}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button
          onClick={() => setActiveSection("settings")}
          title="Settings"
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: activeSection === "settings" ? "var(--r-acc)" : "transparent",
            color: activeSection === "settings" ? "white" : "var(--r-t2)",
            fontSize: "20px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
        >
          ⚙️
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
