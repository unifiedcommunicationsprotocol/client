import { useAppContext } from "../AppContext";
import { MSG_CHANNELS, MSG_DMS } from "../data";

export function MessagesPanel() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--r-bd)] flex-shrink-0">
        <span className="text-sm font-semibold text-[var(--r-t1)]">
          Messages
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-2">
        {/* Channels */}
        <div className="text-xs font-semibold text-[var(--r-t3)] uppercase tracking-[0.08em] px-2 py-1">
          Channels
        </div>
        {MSG_CHANNELS.map((chan) => (
          <button
            key={chan.id}
            type="button"
            onClick={() =>
              dispatch({ type: "selectChannel", payload: chan.id })
            }
            className={`w-full text-left px-3 py-2 mb-0.5 border-none ${
              state.selectedChannel === chan.id
                ? "bg-[var(--r-sel)]"
                : "bg-transparent"
            } text-[var(--r-t1)] cursor-pointer rounded text-sm flex items-center gap-2 transition-colors duration-200`}
            onMouseEnter={(e) => {
              if (state.selectedChannel !== chan.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.selectedChannel !== chan.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }
            }}
          >
            <span className="text-[var(--r-t3)] text-base font-light">
              #
            </span>
            <span>{chan.name}</span>
          </button>
        ))}

        {/* Direct Messages */}
        <div className="text-xs font-semibold text-[var(--r-t3)] uppercase tracking-[0.08em] px-2 py-1 mt-1.5 pt-2 border-t border-[var(--r-bd)]">
          Direct
        </div>
        {MSG_DMS.map((dm) => (
          <button
            key={dm.id}
            type="button"
            onClick={() => dispatch({ type: "selectDM", payload: dm.id })}
            className={`w-full text-left px-3 py-2 mb-0.5 border-none ${
              state.selectedDM === dm.id
                ? "bg-[var(--r-sel)]"
                : "bg-transparent"
            } text-[var(--r-t1)] cursor-pointer rounded text-sm flex items-center gap-2 transition-colors duration-200`}
            onMouseEnter={(e) => {
              if (state.selectedDM !== dm.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.selectedDM !== dm.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }
            }}
          >
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold text-white"
              style={{ backgroundColor: dm.color }}
            >
              {dm.avatar}
            </div>
            <span>{dm.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
