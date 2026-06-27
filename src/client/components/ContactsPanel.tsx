import { useState } from "react";

export function ContactsPanel() {
  const [searchQuery, setSearchQuery] = useState("");

  const contacts = [
    { id: "1", name: "Sarah Chen", handle: "sarah@relay.im", onRelay: true, initials: "SC", color: "#6366F1" },
    { id: "2", name: "Alex Johnson", handle: "alex@example.com", onRelay: true, initials: "AJ", color: "#EA4335" },
    { id: "3", name: "Maya Patel", handle: "maya@relay.im", onRelay: true, initials: "MP", color: "#9333EA" },
    { id: "4", name: "David Lee", handle: "david@acme.com", onRelay: false, initials: "DL", color: "#0EA5E9" },
    { id: "5", name: "Emma Wilson", handle: "emma@company.io", onRelay: true, initials: "EW", color: "#22C55E" },
    { id: "6", name: "Frank Brown", handle: "frank@relay.im", onRelay: false, initials: "FB", color: "#FBBF24" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid var(--r-bd)", flexShrink: 0 }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
          Contacts
        </span>
      </div>

      {/* Search */}
      <div style={{ padding: "7px 10px", borderBottom: "1px solid var(--r-bd)", flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "6px 10px",
            backgroundColor: "var(--r-sf2)",
            borderRadius: "6px",
            border: "1px solid var(--r-bd)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "var(--r-t3)", flexShrink: 0 }}>
            <title>Search</title>
            <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8.5 8.5l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              fontSize: "12.5px",
              color: "var(--r-t1)",
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>
      </div>

      {/* Contact List */}
      <div style={{ flex: 1, overflow: "auto", padding: "6px 8px" }}>
        {contacts.map((contact) => (
          <button
            key={contact.id}
            type="button"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              marginBottom: "2px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              borderRadius: "6px",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              transition: "background-color 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: contact.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "600",
                color: "white",
                flexShrink: 0,
                marginTop: "2px",
              }}
            >
              {contact.initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--r-t1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: "1px",
                }}
              >
                {contact.name}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--r-t3)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {contact.handle}
              </div>
            </div>
            {contact.onRelay && (
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#22C55E",
                  flexShrink: 0,
                  marginTop: "6px",
                }}
                title="On Relay"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
