interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "disabled";
  lastRun?: string;
  runCount?: number;
}

interface ActivityEntry {
  id: string;
  agentName: string;
  action: string;
  timestamp: string;
  status: "success" | "error" | "pending";
}

export function AgentsView() {
  // Mock agent data
  const agents: Agent[] = [
    {
      id: "1",
      name: "Email Classifier",
      description: "Automatically categorizes incoming emails by topic and priority",
      status: "active",
      lastRun: "2 minutes ago",
      runCount: 1240,
    },
    {
      id: "2",
      name: "Calendar Assistant",
      description: "Manages meeting scheduling and sends smart reminders",
      status: "active",
      lastRun: "5 minutes ago",
      runCount: 856,
    },
    {
      id: "3",
      name: "Summarizer",
      description: "Generates summaries of long email threads and documents",
      status: "paused",
      lastRun: "1 hour ago",
      runCount: 423,
    },
    {
      id: "4",
      name: "Contact Enrichment",
      description: "Automatically enriches contact profiles with public information",
      status: "active",
      lastRun: "30 minutes ago",
      runCount: 567,
    },
  ];

  const activityLog: ActivityEntry[] = [
    {
      id: "a1",
      agentName: "Email Classifier",
      action: "Classified 45 emails",
      timestamp: "2 min ago",
      status: "success",
    },
    {
      id: "a2",
      agentName: "Calendar Assistant",
      action: "Created meeting reminder",
      timestamp: "5 min ago",
      status: "success",
    },
    {
      id: "a3",
      agentName: "Summarizer",
      action: "Failed to summarize thread",
      timestamp: "2 hours ago",
      status: "error",
    },
    {
      id: "a4",
      agentName: "Contact Enrichment",
      action: "Updated 12 contact profiles",
      timestamp: "30 min ago",
      status: "success",
    },
    {
      id: "a5",
      agentName: "Email Classifier",
      action: "Processing batch import",
      timestamp: "Just now",
      status: "pending",
    },
  ];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-bg)",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--r-t1)",
            margin: "0 0 4px 0",
          }}
        >
          Agents
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "var(--r-t3)",
            margin: "0",
          }}
        >
          Automate tasks across your workflow
        </p>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          padding: "20px",
          backgroundColor: "var(--r-bg)",
        }}
      >
        {/* Agents Grid */}
        <div style={{ gridColumn: "1 / -1" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--r-t1)",
              marginBottom: "12px",
              margin: "0 0 12px 0",
            }}
          >
            Available Agents
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "12px",
              marginBottom: "32px",
            }}
          >
            {agents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  backgroundColor: "var(--r-sf)",
                  border: "1px solid var(--r-bd)",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "border-color 150ms, box-shadow 150ms",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  const elem = e.currentTarget as HTMLDivElement;
                  elem.style.borderColor = "var(--r-acc)";
                  elem.style.boxShadow = "0 0 0 2px var(--r-accd)";
                }}
                onMouseLeave={(e) => {
                  const elem = e.currentTarget as HTMLDivElement;
                  elem.style.borderColor = "var(--r-bd)";
                  elem.style.boxShadow = "none";
                }}
              >
                {/* Status indicator + Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor:
                        agent.status === "active"
                          ? "#22C55E"
                          : agent.status === "paused"
                            ? "#F59E0B"
                            : "#9CA3AF",
                      flexShrink: 0,
                    }}
                  />
                  <h3
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--r-t1)",
                      margin: "0",
                      flex: 1,
                    }}
                  >
                    {agent.name}
                  </h3>
                  {/* Status toggle */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      width: "32px",
                      height: "18px",
                      borderRadius: "9px",
                      backgroundColor:
                        agent.status === "active" ? "var(--r-acc)" : "var(--r-bd)",
                      padding: "2px",
                      cursor: "pointer",
                      transition: "background-color 150ms",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: "white",
                        marginLeft:
                          agent.status === "active" ? "14px" : "0",
                        transition: "margin 150ms",
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--r-t2)",
                    margin: "0 0 12px 0",
                    lineHeight: "1.5",
                  }}
                >
                  {agent.description}
                </p>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    fontSize: "12px",
                    color: "var(--r-t3)",
                    marginTop: "auto",
                  }}
                >
                  {agent.lastRun && (
                    <div>Last run: {agent.lastRun}</div>
                  )}
                  {agent.runCount && (
                    <div>{agent.runCount.toLocaleString()} runs</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div style={{ gridColumn: "1 / -1" }}>
          <h2
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--r-t1)",
              marginBottom: "12px",
              margin: "0 0 12px 0",
            }}
          >
            Recent Activity
          </h2>
          <div
            style={{
              backgroundColor: "var(--r-sf)",
              border: "1px solid var(--r-bd)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {activityLog.map((entry, idx) => (
              <div
                key={entry.id}
                style={{
                  padding: "12px 16px",
                  borderBottom:
                    idx < activityLog.length - 1 ? "1px solid var(--r-bd)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                {/* Status dot */}
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor:
                      entry.status === "success"
                        ? "#22C55E"
                        : entry.status === "error"
                          ? "#EF4444"
                          : "#9CA3AF",
                    flexShrink: 0,
                  }}
                />

                {/* Activity info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "var(--r-t1)",
                      marginBottom: "2px",
                    }}
                  >
                    {entry.agentName}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--r-t3)",
                    }}
                  >
                    {entry.action}
                  </div>
                </div>

                {/* Timestamp */}
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--r-t3)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {entry.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
