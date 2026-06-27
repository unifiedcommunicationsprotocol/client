interface InboxProps {
  selectedThreadId: string | null;
  onSelectThread: (id: string) => void;
}

export function Inbox({ selectedThreadId }: InboxProps) {
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

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const messages = [
    {
      id: "1",
      from: "alex@example.com",
      timestamp: "2 hours ago",
      content:
        "Hi! Following up on the feedback from last week. Have you had a chance to review the document?",
    },
    {
      id: "2",
      from: "me@relay.im",
      timestamp: "1 hour ago",
      content:
        "Yes, I reviewed it. A few thoughts: the timeline looks good, but I'd suggest expanding section 3 with more examples.",
    },
    {
      id: "3",
      from: "alex@example.com",
      timestamp: "30 minutes ago",
      content: "Great point! I'll add those examples. Should have an updated draft by tomorrow.",
    },
  ];

  if (!selectedThread) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--r-t3)",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
          <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
            No thread selected
          </div>
          <div style={{ fontSize: "14px", color: "var(--r-t3)" }}>
            Select a thread from the sidebar to view messages
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Thread Header */}
      <div
        style={{
          borderBottom: "1px solid var(--r-bd)",
          padding: "16px 20px",
          backgroundColor: "var(--r-bg)",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
          {selectedThread.subject}
        </h2>
        <div style={{ fontSize: "13px", color: "var(--r-t2)" }}>{selectedThread.from}</div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "16px",
              backgroundColor: msg.from === "me@relay.im" ? "var(--r-sel)" : "var(--r-sf)",
              borderRadius: "8px",
              borderLeft: `4px solid ${msg.from === "me@relay.im" ? "var(--r-acc)" : "var(--r-bd)"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--r-t1)" }}>
                {msg.from === "me@relay.im" ? "You" : msg.from}
              </div>
              <div style={{ fontSize: "12px", color: "var(--r-t3)" }}>{msg.timestamp}</div>
            </div>
            <div style={{ fontSize: "14px", color: "var(--r-t1)", lineHeight: "1.5" }}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Compose Area */}
      <div
        style={{
          borderTop: "1px solid var(--r-bd)",
          padding: "16px 20px",
          backgroundColor: "var(--r-bg)",
        }}
      >
        <textarea
          placeholder="Type a reply..."
          style={{
            width: "100%",
            minHeight: "80px",
            marginBottom: "12px",
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
          }}
        />
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button type="button" className="secondary">
            Save as Draft
          </button>
          <button type="button" className="primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
