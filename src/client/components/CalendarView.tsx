import { useAppContext } from "../AppContext";
import { CAL_EVENTS } from "../data";

export function CalendarView() {
  const { state, dispatch } = useAppContext();

  const selectedEvent = state.calSelectedEvent ? CAL_EVENTS.find((e) => e.id === state.calSelectedEvent) : null;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header with navigation */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-bg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "var(--r-t1)", margin: "0" }}>
          Calendar
        </h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => dispatch({ type: "setCalWeekOffset", payload: state.calWeekOffset - 1 })}
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
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "setCalWeekOffset", payload: 0 })}
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
            Today
          </button>
          <button
            type="button"
            onClick={() => dispatch({ type: "setCalWeekOffset", payload: state.calWeekOffset + 1 })}
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
            Next →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {/* Day headers */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--r-bd)", backgroundColor: "var(--r-bg)" }}>
          <div style={{ width: "60px", padding: "8px", borderRight: "1px solid var(--r-bd)", flexShrink: 0 }} />
          {days.map((day) => (
            <div
              key={day}
              style={{
                flex: 1,
                padding: "8px",
                textAlign: "center",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--r-t2)",
                borderRight: "1px solid var(--r-bd)",
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {hours.map((hour) => (
          <div key={hour} style={{ display: "flex", borderBottom: "1px solid var(--r-bd)", minHeight: "56px" }}>
            <div
              style={{
                width: "60px",
                padding: "8px",
                textAlign: "right",
                fontSize: "11px",
                color: "var(--r-t3)",
                borderRight: "1px solid var(--r-bd)",
                flexShrink: 0,
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
            {days.map((day, dayIdx) => (
              <button
                key={`${hour}-${day}`}
                type="button"
                onClick={() => {
                  dispatch({ type: "setCalCreating", payload: true });
                  dispatch({ type: "setCalNewDayIdx", payload: dayIdx });
                  dispatch({ type: "setCalNewStartH", payload: hour });
                  dispatch({ type: "setCalNewEndH", payload: hour + 1 });
                }}
                style={{
                  flex: 1,
                  borderRight: "1px solid var(--r-bd)",
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                  padding: "0",
                  transition: "background-color 150ms",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              />
            ))}
          </div>
        ))}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--r-t1)", margin: "0" }}>
              {selectedEvent.title}
            </h3>
            <button
              type="button"
              onClick={() => dispatch({ type: "setCalSelectedEvent", payload: null })}
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
            {String(Math.round((selectedEvent.startH % 1) * 60)).padStart(2, "0")} - {String(Math.floor(selectedEvent.endH)).padStart(2, "0")}:
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
