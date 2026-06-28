import { useState } from "react";
import { useAppContext } from "../AppContext";
import { THREADS } from "../data";

export function InboxThreadList() {
  const [searchQuery, setSearchQuery] = useState("");
  const { state, dispatch } = useAppContext();

  const unreadCount = THREADS.filter((t) => t.unread > 0).length;
  const filteredThreads = THREADS.filter((thread) =>
    searchQuery
      ? thread.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.preview.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  const toggleVariant = () => {
    dispatch({
      type: "setVariant",
      payload: state.variant === "A" ? "B" : "A",
    });
  };

  const isCompact = state.variant === "A";
  const avatarSize = isCompact ? 28 : 36;
  const avatarSizeStr = `${avatarSize}px`;
  const padding = isCompact ? "py-2 px-3" : "py-3 px-3";
  const gap = isCompact ? "gap-2.5" : "gap-3";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-[var(--r-bd)] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--r-t1)]">
              Inbox
            </span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-[var(--r-acc)] bg-[var(--r-accd)] px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleVariant}
              className="px-2 py-0.5 border border-[var(--r-bd)] rounded bg-transparent text-[var(--r-t3)] text-[10.5px] font-bold cursor-pointer tracking-wider"
              title="Toggle thread view variant"
            >
              {isCompact ? "C" : "S"}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "setComposing", payload: true })}
              className="w-7 h-7 border-none rounded bg-[var(--r-acc)] text-white flex items-center justify-center cursor-pointer flex-shrink-0"
              title="Compose new message"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <title>Compose</title>
                <path
                  d="M5.5 1v9M1 5.5h9"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-3 flex-shrink-0">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-[var(--r-bd)] rounded-md bg-[var(--r-bg)] text-[var(--r-t1)]"
        />
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {filteredThreads.length === 0 ? (
          <div className="px-3 py-5 text-center text-[var(--r-t3)] text-xs">
            No threads found
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isSelected = state.selectedThread === thread.id;
            const borderColor =
              thread.subject.includes("Gmail") || thread.from.includes("GitHub")
                ? "#D97706"
                : thread.subject.includes("scheduler")
                  ? "#8B5CF6"
                  : "transparent";

            return (
              <div
                key={thread.id}
                onClick={() =>
                  dispatch({ type: "selectThread", payload: thread.id })
                }
                className={`${padding} ${gap} border-b border-[var(--r-bd)] cursor-pointer flex items-start transition-colors duration-150 ${
                  isSelected ? "bg-[var(--r-sel)]" : "bg-transparent"
                }`}
                style={{ borderLeftWidth: "2px", borderLeftColor: borderColor }}
              >
                {/* Avatar */}
                <div
                  className="rounded-full flex-shrink-0 flex items-center justify-center text-white font-semibold"
                  style={{
                    width: avatarSizeStr,
                    height: avatarSizeStr,
                    backgroundColor: thread.avatarColor,
                    fontSize: avatarSize > 28 ? "14px" : "12px",
                  }}
                >
                  {thread.avatar}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 relative">
                  {/* From + Time */}
                  <div className="flex justify-between items-start mb-0.5 gap-2">
                    <div
                      className={`text-[12.5px] text-[var(--r-t1)] whitespace-nowrap overflow-hidden text-ellipsis ${
                        thread.unread > 0 ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {thread.from}
                    </div>
                    <div className="text-[11px] text-[var(--r-t3)] whitespace-nowrap flex-shrink-0">
                      {thread.timestamp}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="text-[12.5px] font-medium text-[var(--r-t1)] whitespace-nowrap overflow-hidden text-ellipsis mb-1">
                    {thread.subject}
                  </div>

                  {/* Preview */}
                  <div
                    className={`text-[11.5px] text-[var(--r-t3)] overflow-hidden ${
                      isCompact ? "line-clamp-1" : "line-clamp-2"
                    } ${isCompact ? "mb-0" : "mb-1.5"}`}
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {thread.preview}
                  </div>

                  {/* Spacious: Badges */}
                  {!isCompact && (
                    <div className="flex gap-1.5 flex-wrap">
                      {thread.subject.includes("Gmail") && (
                        <span className="text-[10px] font-medium bg-[#D9770622] text-[#D97706] px-1.5 py-0.5 rounded-sm">
                          Bridge
                        </span>
                      )}
                      {thread.subject.includes("scheduler") && (
                        <span className="text-[10px] font-medium bg-[#8B5CF622] text-[#8B5CF6] px-1.5 py-0.5 rounded-sm">
                          Agent
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Unread Indicator */}
                {thread.unread > 0 && (
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "var(--r-acc)",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
