export function AgentsPanel() {

  const agents = [
    {
      id: "1",
      name: "Email Classifier",
      status: "active",
      description: "Automatically categorizes incoming emails",
    },
    {
      id: "2",
      name: "Calendar Assistant",
      status: "active",
      description: "Manages meeting scheduling and reminders",
    },
    {
      id: "3",
      name: "Summarizer",
      status: "paused",
      description: "Generates summaries of long threads",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid var(--r-bd)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
          Agents
        </span>
        <button
          type="button"
          style={{
            width: "28px",
            height: "28px",
            border: "1px dashed var(--r-bd)",
            borderRadius: "5px",
            backgroundColor: "transparent",
            color: "var(--r-t2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
            transition: "all 200ms",
          }}
          title="Add agent"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--r-acc)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--r-acc)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--r-bd)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--r-t2)";
          }}
        >
          +
        </button>
      </div>

      {/* Agents List */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
        {agents.map((agent) => (
          <button
            type="button"
            key={agent.id}
            onClick={() => {}}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 12px",
              marginBottom: "6px",
              borderRadius: "6px",
              border: "1px solid var(--r-bd)",
              backgroundColor: "var(--r-sf2)",
              cursor: "pointer",
              transition: "background-color 150ms",
              display: "block",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-sf2)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: agent.status === "active" ? "#22C55E" : "#9CA3AF",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--r-t1)",
                  }}
                >
                  {agent.name}
                </div>
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: agent.status === "active" ? "#22C55E" : "#9CA3AF",
                  textTransform: "capitalize",
                }}
              >
                {agent.status}
              </span>
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--r-t3)",
                lineHeight: "1.4",
              }}
            >
              {agent.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
