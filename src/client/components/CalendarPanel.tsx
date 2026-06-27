import { useAppContext } from "../AppContext";
import { CAL_EVENTS } from "../data";

export function CalendarPanel() {
  const { state, dispatch } = useAppContext();

  const getTimeString = (startH: number, endH: number) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(Math.floor(startH))}:${pad(Math.round((startH % 1) * 60))} - ${pad(Math.floor(endH))}:${pad(Math.round((endH % 1) * 60))}`;
  };

  const upcomingEvents = CAL_EVENTS.map((e) => ({
    ...e,
    time: getTimeString(e.startH, e.endH),
  }));

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
          <button
            type="button"
            key={event.id}
            onClick={() => dispatch({ type: "setCalSelectedEvent", payload: event.id })}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 8px",
              marginBottom: "4px",
              borderRadius: "6px",
              backgroundColor: state.calSelectedEvent === event.id ? "var(--r-sel)" : "var(--r-sf2)",
              border: "1px solid var(--r-bd)",
              cursor: "pointer",
              transition: "background-color 150ms",
              display: "block",
            }}
            onMouseEnter={(e) => {
              if (state.calSelectedEvent !== event.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.calSelectedEvent !== event.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-sf2)";
              }
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
          </button>
        ))}
      </div>
    </div>
  );
}
