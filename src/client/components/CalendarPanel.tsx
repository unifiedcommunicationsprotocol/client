import { useState } from "react";

export function CalendarPanel() {
  const [_selectedMonth] = useState(new Date());

  const upcomingEvents = [
    {
      id: "1",
      title: "Team standup",
      time: "Today at 10:00 AM",
    },
    {
      id: "2",
      title: "Design review",
      time: "Tomorrow at 2:00 PM",
    },
    {
      id: "3",
      title: "All hands meeting",
      time: "Friday at 3:00 PM",
    },
    {
      id: "4",
      title: "1:1 with manager",
      time: "Next week",
    },
    {
      id: "5",
      title: "Project kickoff",
      time: "Next Monday",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid var(--r-bd)", flexShrink: 0 }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
          Calendar
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "6px 8px" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--r-t3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "4px 4px 7px",
          }}
        >
          Upcoming
        </div>

        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            style={{
              padding: "10px 8px",
              marginBottom: "4px",
              borderRadius: "6px",
              backgroundColor: "var(--r-sf2)",
              border: "1px solid var(--r-bd)",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--r-t1)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                marginBottom: "1px",
              }}
            >
              {event.title}
            </div>
            <div style={{ fontSize: "11px", color: "var(--r-t3)" }}>
              {event.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
