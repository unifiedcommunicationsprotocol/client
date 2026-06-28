import { useAppContext } from "../AppContext";
import { CalendarMonth } from "./CalendarMonth";
import { CalendarWeek } from "./CalendarWeek";

export function CalendarView() {
  const { state, dispatch } = useAppContext();

  // Get week date range for header
  const today = new Date(2026, 5, 28); // 2026-06-28
  const monday = new Date(today);
  monday.setDate(
    today.getDate() - today.getDay() + 1 + state.calWeekOffset * 7,
  );

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const getDateRangeLabel = () => {
    if (state.calViewType === "week") {
      return `${formatDate(monday)} - ${formatDate(sunday)}`;
    } else {
      const monthName = new Date(
        2026,
        5 + state.calWeekOffset,
        1,
      ).toLocaleDateString("en-US", { month: "long", year: "numeric" });
      return monthName;
    }
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
      {/* Header with navigation and controls */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-bg)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Left: View toggle + Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* View toggle (Week/Month) */}
          <div
            style={{
              display: "flex",
              gap: "0",
              border: "1px solid var(--r-bd)",
              borderRadius: "4px",
              backgroundColor: "var(--r-sf)",
              padding: "2px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "setCalViewType", payload: "week" })
              }
              style={{
                padding: "6px 12px",
                border: "none",
                backgroundColor:
                  state.calViewType === "week" ? "var(--r-bg)" : "transparent",
                color: "var(--r-t1)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "3px",
              }}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() =>
                dispatch({ type: "setCalViewType", payload: "month" })
              }
              style={{
                padding: "6px 12px",
                border: "none",
                backgroundColor:
                  state.calViewType === "month" ? "var(--r-bg)" : "transparent",
                color: "var(--r-t1)",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600",
                borderRadius: "3px",
              }}
            >
              Month
            </button>
          </div>

          {/* Date range label */}
          <div
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--r-t1)",
              minWidth: "120px",
            }}
          >
            {getDateRangeLabel()}
          </div>
        </div>

        {/* Right: Navigation + New event button */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "setCalWeekOffset",
                payload: state.calWeekOffset - 1,
              })
            }
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--r-bd)",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
            title="Previous"
          >
            ‹
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
              fontWeight: "600",
            }}
            title="Today"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "setCalWeekOffset",
                payload: state.calWeekOffset + 1,
              })
            }
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--r-bd)",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
            title="Next"
          >
            ›
          </button>

          <button
            type="button"
            onClick={() => {
              dispatch({ type: "setCalCreating", payload: true });
              dispatch({ type: "setCalNewTitle", payload: "" });
            }}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "var(--r-acc)",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            + New event
          </button>
        </div>
      </div>

      {/* Calendar content (Week or Month) */}
      {state.calViewType === "week" ? <CalendarWeek /> : <CalendarMonth />}
    </div>
  );
}
