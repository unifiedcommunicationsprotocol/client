import { useAppContext } from "../AppContext";
import { THREAD_MSGS, THREADS } from "../data";

export function Inbox() {
  const { state } = useAppContext();

  const selectedThread = THREADS.find((t) => t.id === state.selectedThread);
  const threadMessages = state.selectedThread
    ? THREAD_MSGS[state.selectedThread] || []
    : [];

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
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
          <div
            style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}
          >
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
        <h2
          style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}
        >
          {selectedThread.subject}
        </h2>
        <div style={{ fontSize: "13px", color: "var(--r-t2)" }}>
          {selectedThread.from}
        </div>
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
        {threadMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "16px",
              backgroundColor:
                msg.from === "you@relay.im" ? "var(--r-sel)" : "var(--r-sf)",
              borderRadius: "8px",
              borderLeft: `4px solid ${msg.from === "you@relay.im" ? "var(--r-acc)" : "var(--r-bd)"}`,
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
              <div
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "var(--r-t1)",
                }}
              >
                {msg.from === "you@relay.im" ? "You" : msg.from}
              </div>
              <div style={{ fontSize: "12px", color: "var(--r-t3)" }}>
                {msg.timestamp}
              </div>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--r-t1)",
                lineHeight: "1.5",
              }}
            >
              {msg.body}
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
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
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
