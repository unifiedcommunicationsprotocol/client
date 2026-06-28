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

  const weeks = Array.from({ length: 6 }, (_, i) =>
    days.slice(i * 7, (i + 1) * 7),
  );
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDate = (date: Date) => {
    return CAL_EVENTS.filter(
      (e) => new Date(e.date).toDateString() === date.toDateString(),
    );
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-[var(--r-bd)] bg-[var(--r-bg)]">
        {dayLabels.map((day) => (
          <div
            key={day}
            className="px-2 py-3 text-center text-xs font-semibold text-[var(--r-t2)] border-r border-[var(--r-bd)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 overflow-auto flex flex-col">
        {weeks.map((week, weekIdx) => (
          <div
            key={weekIdx}
            className="grid grid-cols-7 flex-1 border-b border-[var(--r-bd)]"
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
                  className={`${
                    dayIdx < 6 ? "border-r border-[var(--r-bd)]" : ""
                  } ${
                    inCurrentMonth ? "bg-[var(--r-bg)]" : "bg-[var(--r-sf)]"
                  } p-2 cursor-pointer border-none text-left relative overflow-hidden`}
                >
                  {/* Date number */}
                  <div
                    className={`text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                      today_check
                        ? "bg-[var(--r-accd)] text-[var(--r-acc)]"
                        : inCurrentMonth
                          ? "bg-transparent text-[var(--r-t1)]"
                          : "bg-transparent text-[var(--r-t3)]"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  {/* Event dots/chips */}
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
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
                        className="text-xs px-0.5 py-px rounded cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-white"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title.substring(0, 8)}
                      </div>
                    ))}
                    {events.length > 2 && (
                      <div className="text-xs text-[var(--r-t3)] px-0.5 py-px">
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
