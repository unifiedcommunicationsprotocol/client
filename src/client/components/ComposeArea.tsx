import { useAppContext } from "../AppContext";
import { Icon } from "./Icon";

export function ComposeArea() {
  const { state, dispatch } = useAppContext();

  const handleClose = () => {
    dispatch({ type: "setReplyOpen", payload: false });
    dispatch({ type: "setReplyText", payload: "" });
    dispatch({ type: "setReplyTo", payload: "" });
    dispatch({ type: "setReplyCc", payload: "" });
    dispatch({ type: "setReplyBcc", payload: "" });
    dispatch({ type: "setReplyShowCc", payload: false });
    dispatch({ type: "setReplyShowBcc", payload: false });
  };

  const handleSend = async () => {
    if (state.replyText.trim()) {
      try {
        // Parse recipients (comma-separated)
        const parseRecipients = (s: string) =>
          s
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);

        const response = await fetch("/api/message/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId: state.selectedThreadId || "default",
            to: parseRecipients(state.replyTo),
            cc: parseRecipients(state.replyCc),
            bcc: parseRecipients(state.replyBcc),
            plaintext: state.replyText,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Message sent:", data.message);
          handleClose();
        } else {
          const error = await response.json();
          console.error("Failed to send message:", error);
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid var(--r-bd)",
        borderRadius: "8px",
        backgroundColor: "var(--r-sf2)",
        margin: "0 20px 20px",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Header Row */}
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid var(--r-bd)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "var(--r-t2)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          {state.replyIsForward ? "Forward" : "Reply"}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {state.replyIsForward && (
            <input
              type="text"
              placeholder="To..."
              value={state.replyTo}
              onChange={(e) =>
                dispatch({ type: "setReplyTo", payload: e.target.value })
              }
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                border: "1px solid var(--r-bd)",
                borderRadius: "4px",
                backgroundColor: "var(--r-bg)",
                color: "var(--r-t1)",
                width: "120px",
              }}
            />
          )}

          <button
            type="button"
            onClick={() =>
              dispatch({ type: "setReplyShowCc", payload: !state.replyShowCc })
            }
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              fontWeight: "600",
              border: "none",
              backgroundColor: state.replyShowCc
                ? "var(--r-accd)"
                : "transparent",
              color: state.replyShowCc ? "var(--r-acc)" : "var(--r-t3)",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            CC
          </button>

          <button
            type="button"
            onClick={() =>
              dispatch({
                type: "setReplyShowBcc",
                payload: !state.replyShowBcc,
              })
            }
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              fontWeight: "600",
              border: "none",
              backgroundColor: state.replyShowBcc
                ? "var(--r-accd)"
                : "transparent",
              color: state.replyShowBcc ? "var(--r-acc)" : "var(--r-t3)",
              cursor: "pointer",
              borderRadius: "3px",
            }}
          >
            BCC
          </button>

          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: "0",
              width: "20px",
              height: "20px",
              fontSize: "16px",
              border: "none",
              backgroundColor: "transparent",
              color: "var(--r-t3)",
              cursor: "pointer",
            }}
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      </div>

      {/* CC Row */}
      {state.replyShowCc && (
        <div
          style={{
            padding: "6px 12px",
            borderBottom: "1px solid var(--r-bd)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <label
            htmlFor="cc-input"
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--r-t3)",
              minWidth: "30px",
            }}
          >
            CC
          </label>
          <input
            id="cc-input"
            type="text"
            value={state.replyCc}
            onChange={(e) =>
              dispatch({ type: "setReplyCc", payload: e.target.value })
            }
            placeholder="Add CC recipients..."
            style={{
              flex: 1,
              padding: "4px 8px",
              fontSize: "12px",
              border: "1px solid var(--r-bd)",
              borderRadius: "4px",
              backgroundColor: "var(--r-bg)",
              color: "var(--r-t1)",
            }}
          />
        </div>
      )}

      {/* BCC Row */}
      {state.replyShowBcc && (
        <div
          style={{
            padding: "6px 12px",
            borderBottom: "1px solid var(--r-bd)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <label
            htmlFor="bcc-input"
            style={{
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--r-t3)",
              minWidth: "30px",
            }}
          >
            BCC
          </label>
          <input
            id="bcc-input"
            type="text"
            value={state.replyBcc}
            onChange={(e) =>
              dispatch({ type: "setReplyBcc", payload: e.target.value })
            }
            placeholder="Add BCC recipients..."
            style={{
              flex: 1,
              padding: "4px 8px",
              fontSize: "12px",
              border: "1px solid var(--r-bd)",
              borderRadius: "4px",
              backgroundColor: "var(--r-bg)",
              color: "var(--r-t1)",
            }}
          />
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={state.replyText}
        onChange={(e) =>
          dispatch({ type: "setReplyText", payload: e.target.value })
        }
        placeholder="Type your reply..."
        style={{
          width: "100%",
          minHeight: "80px",
          padding: "12px",
          border: "none",
          backgroundColor: "transparent",
          color: "var(--r-t1)",
          fontSize: "13px",
          fontFamily: "inherit",
          resize: "none",
        }}
      />

      {/* Footer */}
      <div
        style={{
          padding: "8px 12px",
          borderTop: "1px solid var(--r-bd)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          type="button"
          style={{
            padding: "0",
            width: "20px",
            height: "20px",
            fontSize: "16px",
            border: "none",
            backgroundColor: "transparent",
            color: "var(--r-t3)",
            cursor: "pointer",
          }}
          title="Attach file"
        >
          <Icon name="paperclip" size={16} />
        </button>

        <button
          type="button"
          onClick={handleSend}
          disabled={!state.replyText.trim()}
          style={{
            padding: "6px 18px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: state.replyText.trim()
              ? "var(--r-acc)"
              : "var(--r-t3)",
            color: "white",
            cursor: state.replyText.trim() ? "pointer" : "default",
            fontSize: "13px",
            fontWeight: "500",
            opacity: state.replyText.trim() ? 1 : 0.5,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
