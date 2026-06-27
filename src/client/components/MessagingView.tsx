import { useAppContext } from "../AppContext";
import type { MsgEntry } from "../data";
import { MSG_CHANNELS, MSG_DMS } from "../data";

export function MessagingView() {
  const { state, dispatch } = useAppContext();

  const channel = MSG_CHANNELS.find((c) => c.id === state.selectedChannel);
  const dm = MSG_DMS.find((d) => d.id === state.selectedDM);

  const displayName = channel?.name
    ? `#${channel.name}`
    : dm?.name || "Select a conversation";
  const currentConversation = channel || dm;

  if (!currentConversation) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--r-t3)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "48px" }}>💬</div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>
          Select a conversation to start messaging
        </div>
      </div>
    );
  }

  const messages = state.selectedChannel
    ? state.customChanMsgs[state.selectedChannel] || []
    : [];

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--r-bd)",
          padding: "16px 20px",
          backgroundColor: "var(--r-bg)",
        }}
      >
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--r-t1)",
            margin: "0",
          }}
        >
          {displayName}
        </h2>
        {channel && (
          <div
            style={{ fontSize: "13px", color: "var(--r-t2)", marginTop: "4px" }}
          >
            {channel.members} members
          </div>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              color: "var(--r-t3)",
              textAlign: "center",
              marginTop: "40px",
            }}
          >
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg: MsgEntry) => (
            <div
              key={msg.id}
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--r-sf)",
                borderRadius: "8px",
                borderLeft: "4px solid var(--r-bd)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "4px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "var(--r-t1)",
                  }}
                >
                  {msg.from}
                </div>
                <div style={{ fontSize: "11px", color: "var(--r-t3)" }}>
                  {msg.timestamp}
                </div>
              </div>
              <div
                style={{
                  fontSize: "13px",
                  color: "var(--r-t1)",
                  lineHeight: "1.4",
                }}
              >
                {msg.body}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div
        style={{
          borderTop: "1px solid var(--r-bd)",
          padding: "16px 20px",
          backgroundColor: "var(--r-bg)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            value={state.msgInputText}
            onChange={(e) =>
              dispatch({ type: "setMsgInputText", payload: e.target.value })
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                state.msgInputText.trim() &&
                state.selectedChannel
              ) {
                dispatch({
                  type: "addChanMsg",
                  payload: {
                    channel: state.selectedChannel,
                    msg: {
                      id: `msg-${Date.now()}`,
                      from: "You",
                      timestamp: new Date().toLocaleTimeString(),
                      body: state.msgInputText,
                    },
                  },
                });
                dispatch({ type: "setMsgInputText", payload: "" });
              }
            }}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px 12px",
              border: "1px solid var(--r-bd)",
              borderRadius: "6px",
              backgroundColor: "var(--r-sf)",
              color: "var(--r-t1)",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (state.msgInputText.trim() && state.selectedChannel) {
                dispatch({
                  type: "addChanMsg",
                  payload: {
                    channel: state.selectedChannel,
                    msg: {
                      id: `msg-${Date.now()}`,
                      from: "You",
                      timestamp: new Date().toLocaleTimeString(),
                      body: state.msgInputText,
                    },
                  },
                });
                dispatch({ type: "setMsgInputText", payload: "" });
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "var(--r-acc)",
              color: "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
