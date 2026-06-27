import { useAppContext } from "../AppContext";
import { THREADS, THREAD_MSGS } from "../data";

export function ThreadView() {
  const { state, dispatch } = useAppContext();

  const selectedThread = THREADS.find((t) => t.id === state.selectedThread);
  const threadMessages = state.selectedThread ? (THREAD_MSGS[state.selectedThread] || []) : [];

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
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📧</div>
          <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}>
            No thread selected
          </div>
          <div style={{ fontSize: "14px", color: "var(--r-t3)" }}>
            Select a thread from the sidebar to view messages
          </div>
        </div>
      </div>
    );
  }

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
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px", color: "var(--r-t1)" }}>
          {selectedThread.subject}
        </h2>
        <div style={{ fontSize: "13px", color: "var(--r-t2)" }}>{selectedThread.from}</div>
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
        {threadMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: "16px",
              backgroundColor: msg.from === "you@relay.im" ? "var(--r-sel)" : "var(--r-sf)",
              borderRadius: "8px",
              borderLeft: `4px solid ${msg.from === "you@relay.im" ? "var(--r-acc)" : "var(--r-bd)"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div style={{ fontWeight: "600", fontSize: "14px", color: "var(--r-t1)" }}>
                {msg.from === "you@relay.im" ? "You" : msg.from}
              </div>
              <div style={{ fontSize: "12px", color: "var(--r-t3)" }}>{msg.timestamp}</div>
            </div>
            <div style={{ fontSize: "14px", color: "var(--r-t1)", lineHeight: "1.5" }}>
              {msg.body}
            </div>
            {msg.encrypted && (
              <div style={{ fontSize: "11px", color: "var(--r-safe)", marginTop: "8px" }}>
                ✓ Encrypted end-to-end
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply/Forward Compose Area */}
      {state.replyOpen ? (
        <div
          style={{
            borderTop: "1px solid var(--r-bd)",
            padding: "16px 20px",
            backgroundColor: "var(--r-bg)",
          }}
        >
          <div style={{ marginBottom: "12px", fontSize: "13px", color: "var(--r-t2)" }}>
            {state.replyIsForward ? "Forwarding to:" : "Replying to:"} {state.replyTo}
            {state.replyShowCc && state.replyCc && `, ${state.replyCc}`}
            {state.replyShowBcc && state.replyBcc && `, ${state.replyBcc}`}
          </div>
          <textarea
            value={state.replyText}
            onChange={(e) => dispatch({ type: "setReplyText", payload: e.target.value })}
            placeholder="Type your reply..."
            style={{
              width: "100%",
              minHeight: "100px",
              marginBottom: "12px",
              fontFamily: "inherit",
              padding: "10px",
              border: "1px solid var(--r-bd)",
              borderRadius: "6px",
              backgroundColor: "var(--r-sf)",
              color: "var(--r-t1)",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => dispatch({ type: "setReplyOpen", payload: false })}
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
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (state.selectedThread && state.replyText.trim()) {
                  dispatch({
                    type: "addThreadMsg",
                    payload: {
                      threadId: state.selectedThread,
                      msg: {
                        id: `${state.selectedThread}-reply-${Date.now()}`,
                        from: "you@relay.im",
                        timestamp: new Date().toLocaleString(),
                        subject: state.replyIsForward ? `Fwd: ${selectedThread.subject}` : `Re: ${selectedThread.subject}`,
                        body: state.replyText,
                        encrypted: true,
                      },
                    },
                  });
                  dispatch({ type: "setReplyText", payload: "" });
                  dispatch({ type: "setReplyOpen", payload: false });
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
      ) : (
        <div
          style={{
            borderTop: "1px solid var(--r-bd)",
            padding: "16px 20px",
            backgroundColor: "var(--r-bg)",
            display: "flex",
            gap: "8px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "setReplyOpen", payload: true });
              dispatch({ type: "setReplyIsForward", payload: false });
              dispatch({ type: "setReplyTo", payload: selectedThread.from });
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
              dispatch({ type: "setReplyTo", payload: selectedThread.from });
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
    </div>
  );
}
