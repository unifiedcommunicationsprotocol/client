import { useAppContext } from "../AppContext";
import { CAL_EVENTS } from "../data";

export function CalendarMonth() {
  const { state, dispatch } = useAppContext();

  // Get current month (June 2026)
  const today = new Date(2026, 5, 28);
  const year = today.getFullYear();
  const month = today.getMonth() + state.calWeekOffset; // Use week offset as month offset for now

  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    days.push(date);
  }

  const weeks = Array.from({ length: 6 }, (_, i) => days.slice(i * 7, (i + 1) * 7));
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDate = (date: Date) => {
    return CAL_EVENTS.filter(
      (e) =>
        new Date(e.date).toDateString() === date.toDateString(),
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
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
      {/* Day labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-bg)",
        }}
      >
        {dayLabels.map((day) => (
          <div
            key={day}
            style={{
              padding: "12px 8px",
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

      {/* Calendar grid */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              flex: 1,
              borderBottom: "1px solid var(--r-bd)",
            }}
          >
            {week.map((date, dayIdx) => {
              const events = getEventsForDate(date);
              const today_check = isToday(date);
              const inCurrentMonth = isCurrentMonth(date);

              return (
                <button
                  key={`${weekIdx}-${dayIdx}`}
                  type="button"
                  onClick={() => {
                    dispatch({ type: "setCalCreating", payload: true });
                    dispatch({ type: "setCalNewTitle", payload: "" });
                  }}
                  style={{
                    borderRight: dayIdx < 6 ? "1px solid var(--r-bd)" : "none",
                    backgroundColor: inCurrentMonth ? "var(--r-bg)" : "var(--r-sf)",
                    padding: "8px",
                    cursor: "pointer",
                    border: "none",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Date number */}
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "500",
                      color: today_check ? "var(--r-acc)" : inCurrentMonth ? "var(--r-t1)" : "var(--r-t3)",
                      marginBottom: "4px",
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      backgroundColor: today_check ? "var(--r-accd)" : "transparent",
                    }}
                  >
                    {date.getDate()}
                  </div>

                  {/* Event dots/chips */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "2px",
                      marginTop: "2px",
                    }}
                  >
                    {events.slice(0, 2).map((event, idx) => (
                      <div
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({
                            type: "setCalSelectedEvent",
                            payload: event.id,
                          });
                        }}
                        style={{
                          fontSize: "9px",
                          padding: "1px 3px",
                          borderRadius: "2px",
                          backgroundColor: event.color,
                          color: "white",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                        }}
                      >
                        {event.title.substring(0, 8)}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div
                        style={{
                          fontSize: "9px",
                          color: "var(--r-t3)",
                          padding: "1px 3px",
                        }}
                      >
                        +{events.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
