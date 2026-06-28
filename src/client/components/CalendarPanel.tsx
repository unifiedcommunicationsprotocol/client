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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--r-bd)] flex-shrink-0">
        <span className="text-sm font-semibold text-[var(--r-t1)]">
          Calendar
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-2 py-1.5">
        <div className="text-xs font-semibold text-[var(--r-t3)] uppercase tracking-[0.08em] px-1 py-1.5">
          Upcoming
        </div>

        {upcomingEvents.map((event) => (
          <button
            type="button"
            key={event.id}
            onClick={() =>
              dispatch({ type: "setCalSelectedEvent", payload: event.id })
            }
            className={`w-full text-left px-2 py-2.5 mb-1 rounded-md ${
              state.calSelectedEvent === event.id
                ? "bg-[var(--r-sel)]"
                : "bg-[var(--r-sf2)]"
            } border border-[var(--r-bd)] cursor-pointer transition-colors duration-150 block`}
            onMouseEnter={(e) => {
              if (state.calSelectedEvent !== event.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.calSelectedEvent !== event.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-sf2)";
              }
            }}
          >
            <div className="text-xs font-medium text-[var(--r-t1)] whitespace-nowrap overflow-hidden text-ellipsis mb-0.5">
              {event.title}
            </div>
            <div className="text-xs text-[var(--r-t3)]">
              {event.time}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
