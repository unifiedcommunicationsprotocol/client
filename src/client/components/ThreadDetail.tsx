import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import { THREAD_MSGS, THREADS } from "../data";
import { useMessaging } from "../../lib/useMessaging";
import { ComposeArea } from "./ComposeArea";
import { Icon } from "./Icon";

interface ApiMessage {
  id: string;
  threadId: string;
  from: string;
  ciphertext: string;
  signature: string;
  clientTs: number;
  status?: string;
  serverTs?: number;
}

export function ThreadDetail() {
  const { state, dispatch } = useAppContext();
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { subscribe } = useMessaging(state.selectedThread);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!state.selectedThread) return;

    const unsubscribe = subscribe((newMessage) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    });

    return unsubscribe;
  }, [state.selectedThread, subscribe]);

  // Fetch messages from API when thread is selected
  useEffect(() => {
    if (!state.selectedThread) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/message/list?threadId=${state.selectedThread}&limit=50`
        );
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        } else {
          // Fallback to fixture data
          const fixtureMessages = THREAD_MSGS[state.selectedThread] || [];
          setMessages(
            fixtureMessages.map((msg) => ({
              id: msg.id,
              threadId: state.selectedThread,
              from: msg.from,
              ciphertext: msg.body,
              signature: "sig_placeholder",
              clientTs: Date.parse(msg.timestamp),
              status: "delivered",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        // Fallback to fixture data
        const fixtureMessages = THREAD_MSGS[state.selectedThread] || [];
        setMessages(
          fixtureMessages.map((msg) => ({
            id: msg.id,
            threadId: state.selectedThread,
            from: msg.from,
            ciphertext: msg.body,
            signature: "sig_placeholder",
            clientTs: Date.parse(msg.timestamp),
            status: "delivered",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [state.selectedThread]);

  const selectedThread = THREADS.find((t) => t.id === state.selectedThread);

  // Combine API messages with any custom messages from state
  const threadMessages = state.selectedThread
    ? [
        ...messages,
        ...(state.customThreadMsgs[state.selectedThread] || []),
      ]
    : [];

  if (!selectedThread) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--r-t3)",
          textAlign: "center",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            <Icon name="email" size={48} />
          </div>
          <div
            style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}
          >
            No thread selected
          </div>
          <div style={{ fontSize: "14px", color: "var(--r-t3)" }}>
            Select a thread from the inbox to view messages
          </div>
        </div>
      </div>
    );
  }

  const isBridge =
    selectedThread.subject.includes("GitHub") ||
    selectedThread.from.includes("Gmail");
  const isAgent = selectedThread.subject.includes("scheduler");

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Thread Header */}
      <div
        style={{
          borderBottom: "1px solid var(--r-bd)",
          padding: "16px 20px",
          backgroundColor: "var(--r-bg)",
          flexShrink: 0,
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "8px",
            color: "var(--r-t1)",
          }}
        >
          {selectedThread.subject}
        </h2>
        <div
          style={{
            fontSize: "12px",
            color: "var(--r-t3)",
            fontFamily: "'Space Mono', monospace",
            marginBottom: "8px",
          }}
        >
          from {selectedThread.from}
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {isBridge && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: "500",
                backgroundColor: "#D9770622",
                color: "#D97706",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              🌉 Bridged via Gmail
            </span>
          )}
          {isAgent && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: "500",
                backgroundColor: "#8B5CF622",
                color: "#8B5CF6",
                padding: "4px 8px",
                borderRadius: "4px",
              }}
            >
              🤖 Agent action
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {threadMessages.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              color: "var(--r-t3)",
              padding: "40px 20px",
            }}
          >
            No messages yet
          </div>
        )}
        {loading && (
          <div
            style={{
              textAlign: "center",
              color: "var(--r-t3)",
              padding: "40px 20px",
            }}
          >
            Loading messages...
          </div>
        )}
        {threadMessages.map((msg) => {
          const isOutgoing = msg.from === "you@relay.im";
          const encrypted = msg.signature !== undefined;
          const body = "body" in msg ? msg.body : msg.ciphertext;
          const timestamp =
            "timestamp" in msg
              ? msg.timestamp
              : new Date(msg.clientTs).toLocaleString();

          return (
            <div
              key={msg.id}
              style={{
                backgroundColor: "var(--r-sf)",
                border: "1px solid var(--r-bd)",
                borderRadius: "8px",
                padding: "16px 18px",
              }}
            >
              {/* Message Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: isOutgoing ? "#4F46E5" : "#6366F1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    {isOutgoing ? "Y" : msg.from.substring(0, 1).toUpperCase()}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "var(--r-t1)",
                      }}
                    >
                      {isOutgoing ? "You" : msg.from}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontFamily: "'Space Mono', monospace",
                        color: "var(--r-t3)",
                      }}
                    >
                      {msg.from === "you@relay.im" ? "you@relay.im" : msg.from}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexShrink: 0,
                  }}
                >
                  {encrypted ? (
                    <Icon name="lock" size={18} />
                  ) : (
                    <Icon name="unlock" size={18} />
                  )}
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--r-t3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {timestamp}
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div
                style={{
                  fontSize: "14px",
                  color: "var(--r-t1)",
                  lineHeight: "1.7",
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                }}
              >
                {body}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reply/Forward Toolbar */}
      {!state.replyOpen && (
        <div
          style={{
            borderTop: "1px solid var(--r-bd)",
            padding: "12px 20px",
            backgroundColor: "var(--r-bg)",
            display: "flex",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "setReplyOpen", payload: true });
              dispatch({ type: "setReplyIsForward", payload: false });
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid var(--r-bd)",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Reply
          </button>
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "setReplyOpen", payload: true });
              dispatch({ type: "setReplyIsForward", payload: true });
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "1px solid var(--r-bd)",
              backgroundColor: "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Forward
          </button>
        </div>
      )}

      {/* Compose Area (Reply/Forward) */}
      {state.replyOpen && <ComposeArea />}
    </div>
  );
}
