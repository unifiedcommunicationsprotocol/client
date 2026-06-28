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
      description:
        "Automatically categorizes incoming emails by topic and priority",
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
      description:
        "Automatically enriches contact profiles with public information",
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--r-bd)] bg-[var(--r-bg)]">
        <h1 className="text-[22px] font-bold text-[var(--r-t1)] mb-1">
          Agents
        </h1>
        <p className="text-sm text-[var(--r-t3)]">
          Automate tasks across your workflow
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto grid grid-cols-2 gap-5 p-5 bg-[var(--r-bg)]">
        {/* Agents Grid */}
        <div className="col-span-2">
          <h2 className="text-base font-semibold text-[var(--r-t1)] mb-3">
            Available Agents
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3 mb-8">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-[var(--r-sf)] border border-[var(--r-bd)] rounded-lg p-4 flex flex-col cursor-pointer transition-all duration-150"
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
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        agent.status === "active"
                          ? "#22C55E"
                          : agent.status === "paused"
                            ? "#F59E0B"
                            : "#9CA3AF",
                    }}
                  />
                  <h3 className="text-sm font-semibold text-[var(--r-t1)] flex-1">
                    {agent.name}
                  </h3>
                  {/* Status toggle */}
                  <div
                    className="inline-flex items-center w-8 h-[18px] rounded-full px-0.5 cursor-pointer transition-colors duration-150"
                    style={{
                      backgroundColor:
                        agent.status === "active"
                          ? "var(--r-acc)"
                          : "var(--r-bd)",
                    }}
                  >
                    <div
                      className="w-[14px] h-[14px] rounded-full bg-white transition-all duration-150"
                      style={{
                        marginLeft: agent.status === "active" ? "14px" : "0",
                      }}
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[var(--r-t2)] mb-3 leading-relaxed">
                  {agent.description}
                </p>

                {/* Stats */}
                <div className="flex gap-3 text-[11px] text-[var(--r-t3)] mt-auto">
                  {agent.lastRun && <div>Last run: {agent.lastRun}</div>}
                  {agent.runCount && (
                    <div>{agent.runCount.toLocaleString()} runs</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="col-span-2">
          <h2 className="text-base font-semibold text-[var(--r-t1)] mb-3">
            Recent Activity
          </h2>
          <div className="bg-[var(--r-sf)] border border-[var(--r-bd)] rounded-lg overflow-hidden">
            {activityLog.map((entry, idx) => (
              <div
                key={entry.id}
                className={`px-4 py-3 flex items-center gap-3 ${
                  idx < activityLog.length - 1
                    ? "border-b border-[var(--r-bd)]"
                    : ""
                }`}
              >
                {/* Status dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      entry.status === "success"
                        ? "#22C55E"
                        : entry.status === "error"
                          ? "#EF4444"
                          : "#9CA3AF",
                  }}
                />

                {/* Activity info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[var(--r-t1)] mb-0.5">
                    {entry.agentName}
                  </div>
                  <div className="text-[11px] text-[var(--r-t3)]">
                    {entry.action}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="text-[10px] text-[var(--r-t3)] whitespace-nowrap">
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
