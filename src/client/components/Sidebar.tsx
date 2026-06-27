import { useState } from "react";
import { useAppContext } from "../AppContext";
import { MessagesPanel } from "./MessagesPanel";
import { CalendarPanel } from "./CalendarPanel";
import { ContactsPanel } from "./ContactsPanel";
import { NotesPanel } from "./NotesPanel";
import { AgentsPanel } from "./AgentsPanel";
import { THREADS } from "../data";

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { state, dispatch } = useAppContext();

  const unreadCount = THREADS.filter((t) => t.unread > 0).length;
  const filteredThreads = THREADS.filter((thread) =>
    searchQuery
      ? thread.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.preview.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <div
      style={{
        width: "272px",
        backgroundColor: "var(--r-sf)",
        borderRight: "1px solid var(--r-bd)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Inbox Section */}
      {state.view === "inbox" && (
        <>
          {/* Header */}
          <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid var(--r-bd)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
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
                  A/V
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
          <div style={{ padding: "12px" }}>
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
          <div style={{ flex: 1, overflow: "auto" }}>
            {filteredThreads.map((thread) => (
              <button
                type="button"
                key={thread.id}
                onClick={() => dispatch({ type: "selectThread", payload: thread.id })}
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "12px",
                  padding: "12px",
                  margin: "0",
                  border: "none",
                  backgroundColor: state.selectedThread === thread.id ? "var(--r-sel)" : "transparent",
                  cursor: "pointer",
                  transition: "background-color 200ms",
                  borderLeft: thread.unread > 0 ? "3px solid var(--r-acc)" : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (state.selectedThread !== thread.id) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (state.selectedThread !== thread.id) {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                  }
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    minWidth: "32px",
                    borderRadius: "6px",
                    backgroundColor: thread.avatarColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "white",
                  }}
                >
                  {thread.avatar}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: thread.unread > 0 ? "600" : "500",
                        color: "var(--r-t1)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        flex: 1,
                      }}
                    >
                      {thread.from}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "var(--r-t3)",
                        marginLeft: "8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {thread.timestamp}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "var(--r-t1)",
                      marginBottom: "4px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {thread.subject}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--r-t2)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      lineHeight: "1.4",
                    }}
                  >
                    {thread.preview}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Messages Section */}
      {state.view === "messaging" && <MessagesPanel />}

      {/* Calendar Section */}
      {state.view === "calendar" && <CalendarPanel />}

      {/* Contacts Section */}
      {state.view === "contacts" && <ContactsPanel />}

      {/* Notes Section */}
      {state.view === "notes" && <NotesPanel />}

      {/* Agents Section */}
      {state.view === "agents" && <AgentsPanel />}
    </div>
  );
}
