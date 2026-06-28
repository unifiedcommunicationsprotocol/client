import { useAppContext } from "../AppContext";
import { CAL_EVENTS } from "../data";

export function CalendarWeek() {
  const { state, dispatch } = useAppContext();

  // Get week starting Monday
  const today = new Date(2026, 5, 28); // 2026-06-28 (example, replace with actual)
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1 + state.calWeekOffset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(date.getDate() + i);
    return date;
  });

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const selectedEvent = state.calSelectedEvent
    ? CAL_EVENTS.find((e) => e.id === state.calSelectedEvent)
    : null;

  // Get events for the selected week
  const weekEvents = CAL_EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    const firstDay = days[0];
    const lastDay = days[6];
    if (!firstDay || !lastDay) return false;
    return eventDate >= firstDay && eventDate <= lastDay;
  });

  const getEventPosition = (event: typeof CAL_EVENTS[0]) => {
    const eventDate = new Date(event.date);
    const eventDateStr = eventDate.toDateString();
    const dayIdx = days.findIndex((d) => d.toDateString() === eventDateStr);
    if (dayIdx === -1) return null;

    const top = event.startH * 56; // 56px per hour
    const height = (event.endH - event.startH) * 56;

    return { dayIdx, top, height };
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "52px repeat(7, 1fr)",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-bg)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ gridColumn: 1 }} />
        {days.map((date, idx) => {
          const isToday =
            date.toDateString() === new Date(2026, 5, 28).toDateString();
          return (
            <div
              key={idx}
              style={{
                padding: "12px 8px",
                textAlign: "center",
                borderRight: "1px solid var(--r-bd)",
                backgroundColor: isToday ? "var(--r-accd)" : "var(--r-bg)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: isToday ? "var(--r-acc)" : "var(--r-t2)",
                  marginBottom: "4px",
                }}
              >
                {dayLabels[idx]}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: isToday ? "var(--r-acc)" : "var(--r-t1)",
                }}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time grid with events */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {hours.map((hour) => (
          <div
            key={hour}
            style={{
              display: "grid",
              gridTemplateColumns: "52px repeat(7, 1fr)",
              borderBottom: "1px solid var(--r-bd)",
              minHeight: "56px",
            }}
          >
            {/* Hour label */}
            <div
              style={{
                padding: "8px",
                textAlign: "right",
                fontSize: "11px",
                color: "var(--r-t3)",
                borderRight: "1px solid var(--r-bd)",
                backgroundColor: "var(--r-bg)",
                position: "sticky",
                left: 0,
                zIndex: 5,
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>

            {/* Day cells */}
            {days.map((_, dayIdx) => (
              <button
                key={`${hour}-${dayIdx}`}
                type="button"
                onClick={() => {
                  dispatch({ type: "setCalCreating", payload: true });
                  dispatch({ type: "setCalNewDayIdx", payload: dayIdx });
                  dispatch({ type: "setCalNewStartH", payload: hour });
                  dispatch({ type: "setCalNewEndH", payload: hour + 1 });
                  dispatch({ type: "setCalNewTitle", payload: "" });
                }}
                style={{
                  borderRight: "1px solid var(--r-bd)",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0",
                  position: "relative",
                }}
              />
            ))}
          </div>
        ))}

        {/* Absolute positioned events */}
        {weekEvents.map((event) => {
          const pos = getEventPosition(event);
          if (!pos) return null;

          return (
            <button
              key={event.id}
              type="button"
              onClick={() =>
                dispatch({ type: "setCalSelectedEvent", payload: event.id })
              }
              style={{
                position: "absolute",
                left: `calc(52px + ${pos.dayIdx} * (100% - 52px) / 7 + 2px)`,
                top: `${pos.top}px`,
                width: `calc((100% - 52px) / 7 - 4px)`,
                height: `${Math.max(pos.height, 32)}px`,
                backgroundColor: event.color,
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "4px 6px",
                cursor: "pointer",
                overflow: "hidden",
                fontSize: "11px",
                fontWeight: "500",
                textAlign: "left",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                zIndex: 20,
              }}
            >
              {event.title}
            </button>
          );
        })}
      </div>

      {/* Event detail panel */}
      {selectedEvent && (
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--r-bd)",
            backgroundColor: "var(--r-bg)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "12px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "var(--r-t1)",
                margin: "0",
              }}
            >
              {selectedEvent.title}
            </h3>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "setCalSelectedEvent", payload: null })
              }
              style={{
                background: "none",
                border: "none",
                color: "var(--r-t2)",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✕
            </button>
          </div>
          <div style={{ fontSize: "13px", color: "var(--r-t2)" }}>
            {String(Math.floor(selectedEvent.startH)).padStart(2, "0")}:
            {String(Math.round((selectedEvent.startH % 1) * 60)).padStart(
              2,
              "0",
            )}{" "}
            - {String(Math.floor(selectedEvent.endH)).padStart(2, "0")}:
            {String(Math.round((selectedEvent.endH % 1) * 60)).padStart(2, "0")}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid var(--r-bd)",
                backgroundColor: "transparent",
                color: "var(--r-t1)",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Edit
            </button>
            <button
              type="button"
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #EF4444",
                backgroundColor: "transparent",
                color: "#EF4444",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
