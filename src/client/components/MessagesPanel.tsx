export function MessagesPanel() {
  const channels = [
    { id: "1", name: "announcements" },
    { id: "2", name: "general" },
    { id: "3", name: "engineering" },
  ];

  const directMessages = [
    { id: "1", name: "Alex Chen", initials: "AC", color: "#6366F1" },
    { id: "2", name: "Sarah Kim", initials: "SK", color: "#EA4335" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid var(--r-bd)", flexShrink: 0 }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
          Messages
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
        {/* Channels */}
        <div style={{ fontSize: "10px", fontWeight: "600", color: "var(--r-t3)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 8px 5px" }}>
          Channels
        </div>
        {channels.map((chan) => (
          <button
            key={chan.id}
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
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
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
            <span style={{ color: "var(--r-t3)", fontSize: "14px", fontWeight: "300" }}>
              #
            </span>
            <span>{chan.name}</span>
          </button>
        ))}

        {/* Direct Messages */}
        <div
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--r-t3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "10px 8px 5px",
            borderTop: "1px solid var(--r-bd)",
            marginTop: "6px",
          }}
        >
          Direct
        </div>
        {directMessages.map((dm) => (
          <button
            key={dm.id}
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
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
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
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: dm.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "600",
                color: "white",
              }}
            >
              {dm.initials}
            </div>
            <span>{dm.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
