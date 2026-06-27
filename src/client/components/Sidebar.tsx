import { useState } from "react";

interface SidebarProps {
  activeSection: string;
}

export function Sidebar({ activeSection }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const threads = [
    {
      id: "1",
      from: "alex@example.com",
      subject: "Q3 Review Discussion",
      preview: "Following up on the feedback from last week...",
      timestamp: "2 hours ago",
      unread: 2,
      avatar: "🔵",
    },
    {
      id: "2",
      from: "team@company.com",
      subject: "Team sync notes",
      preview: "Here are the notes from today's standup...",
      timestamp: "4 hours ago",
      unread: 0,
      avatar: "👥",
    },
    {
      id: "3",
      from: "sarah@example.com",
      subject: "Weekend plans?",
      preview: "Hey! Are you free this Saturday?",
      timestamp: "1 day ago",
      unread: 0,
      avatar: "👩",
    },
  ];

  const sidebarSections: Record<string, { title: string; items: string[] }> = {
    inbox: {
      title: "Inbox",
      items: ["All Mail", "Unread", "Starred", "Sent", "Drafts"],
    },
    messaging: {
      title: "Conversations",
      items: ["Direct Messages", "Groups", "Channels"],
    },
    calendar: {
      title: "Calendars",
      items: ["My Calendar", "Shared", "Holidays"],
    },
    contacts: {
      title: "Contacts",
      items: ["All Contacts", "Starred", "Recent"],
    },
    notes: {
      title: "Notebooks",
      items: ["Personal", "Work", "Ideas"],
    },
    agents: {
      title: "Agents",
      items: ["My Agents", "Shared", "Public"],
    },
  };

  const section: typeof sidebarSections.inbox =
    sidebarSections[activeSection] || sidebarSections.inbox;

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "var(--r-sf)",
        borderRight: "1px solid var(--r-bd)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Search */}
      <div style={{ padding: "12px" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "13px",
            border: "1px solid var(--r-bd)",
            borderRadius: "6px",
            backgroundColor: "var(--r-bg)",
          }}
        />
      </div>

      {/* Sidebar Items */}
      <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
        {section?.items.map((item) => (
          <button
            key={item}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              fontSize: "14px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              borderRadius: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Thread List */}
      {activeSection === "inbox" && (
        <div style={{ flex: 1, overflow: "auto", padding: "12px" }}>
          <div
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--r-t3)",
              marginBottom: "8px",
              paddingLeft: "4px",
            }}
          >
            THREADS
          </div>
          {threads.map((thread) => (
            <button
              key={thread.id}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px",
                marginBottom: "4px",
                border: "1px solid transparent",
                backgroundColor: "var(--r-bg)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--r-bd)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-bg)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}
              >
                <span style={{ fontSize: "20px" }}>{thread.avatar}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: thread.unread > 0 ? "600" : "500",
                      color: "var(--r-t1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {thread.from.split("@")[0]}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--r-t3)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {thread.timestamp}
                  </div>
                </div>
                {thread.unread > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--r-acc)",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "600",
                      borderRadius: "10px",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {thread.unread}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--r-t2)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  paddingLeft: "28px",
                }}
              >
                {thread.preview}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
