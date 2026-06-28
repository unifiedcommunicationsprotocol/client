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
  const padding = isCompact ? "9px 12px" : "14px 12px";
  const gap = isCompact ? "10px" : "12px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "11px 12px 9px",
          borderBottom: "1px solid var(--r-bd)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--r-t1)",
              }}
            >
              Inbox
            </span>
            {unreadCount > 0 && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "var(--r-acc)",
                  backgroundColor: "var(--r-accd)",
                  padding: "1px 6px",
                  borderRadius: "10px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              type="button"
              onClick={toggleVariant}
              style={{
                padding: "3px 8px",
                border: "1px solid var(--r-bd)",
                borderRadius: "4px",
                backgroundColor: "transparent",
                color: "var(--r-t3)",
                fontSize: "10.5px",
                fontWeight: "600",
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.02em",
              }}
              title="Toggle thread view variant"
            >
              {isCompact ? "C" : "S"}
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: "setComposing", payload: true })}
              style={{
                width: "28px",
                height: "28px",
                border: "none",
                borderRadius: "5px",
                backgroundColor: "var(--r-acc)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
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
      <div style={{ padding: "12px", flexShrink: 0 }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "13px",
            border: "1px solid var(--r-bd)",
            borderRadius: "6px",
            backgroundColor: "var(--r-bg)",
            color: "var(--r-t1)",
          }}
        />
      </div>

      {/* Thread List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {filteredThreads.length === 0 ? (
          <div
            style={{
              padding: "20px 12px",
              textAlign: "center",
              color: "var(--r-t3)",
              fontSize: "13px",
            }}
          >
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
                style={{
                  padding,
                  borderBottom: "1px solid var(--r-bd)",
                  borderLeft: `2px solid ${borderColor}`,
                  backgroundColor: isSelected ? "var(--r-sel)" : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  gap,
                  alignItems: "flex-start",
                  transition: "background-color 150ms",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: avatarSizeStr,
                    height: avatarSizeStr,
                    borderRadius: "50%",
                    backgroundColor: thread.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: avatarSize > 28 ? "14px" : "12px",
                    fontWeight: "600",
                    flexShrink: 0,
                  }}
                >
                  {thread.avatar}
                </div>

                {/* Content */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    position: "relative",
                  }}
                >
                  {/* From + Time */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "2px",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: thread.unread > 0 ? "600" : "500",
                        color: "var(--r-t1)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {thread.from}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--r-t3)",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {thread.timestamp}
                    </div>
                  </div>

                  {/* Subject */}
                  <div
                    style={{
                      fontSize: "12.5px",
                      fontWeight: "500",
                      color: "var(--r-t1)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: "4px",
                    }}
                  >
                    {thread.subject}
                  </div>

                  {/* Preview */}
                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "var(--r-t3)",
                      display: "-webkit-box",
                      WebkitLineClamp: isCompact ? 1 : 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      marginBottom: isCompact ? "0" : "6px",
                    }}
                  >
                    {thread.preview}
                  </div>

                  {/* Spacious: Badges */}
                  {!isCompact && (
                    <div
                      style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}
                    >
                      {thread.subject.includes("Gmail") && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "500",
                            backgroundColor: "#D9770622",
                            color: "#D97706",
                            padding: "2px 6px",
                            borderRadius: "3px",
                          }}
                        >
                          Bridge
                        </span>
                      )}
                      {thread.subject.includes("scheduler") && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "500",
                            backgroundColor: "#8B5CF622",
                            color: "#8B5CF6",
                            padding: "2px 6px",
                            borderRadius: "3px",
                          }}
                        >
                          Agent
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Unread Indicator */}
                {thread.unread > 0 && (
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "var(--r-acc)",
                      flexShrink: 0,
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
