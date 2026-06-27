import { useAppContext } from "../AppContext";

export function ComposeModal() {
  const { state, dispatch } = useAppContext();

  if (!state.composing) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "520px",
        maxHeight: "80vh",
        backgroundColor: "var(--r-sf)",
        borderRadius: "12px",
        border: "1px solid var(--r-bd)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--r-bd)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--r-t1)" }}>
          Compose
        </h2>
        <button
          type="button"
          onClick={() => dispatch({ type: "setComposing", payload: false })}
          style={{
            background: "none",
            border: "none",
            color: "var(--r-t2)",
            cursor: "pointer",
            fontSize: "20px",
            padding: "0",
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
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
        {/* To Field */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--r-t2)" }}>
            To
          </label>
          <input
            type="text"
            placeholder="recipient@relay.im"
            style={{
              width: "100%",
              padding: "8px 12px",
              marginTop: "4px",
              border: "1px solid var(--r-bd)",
              borderRadius: "6px",
              backgroundColor: "var(--r-bg)",
              color: "var(--r-t1)",
              fontSize: "13px",
            }}
          />
        </div>

        {/* Subject Field */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--r-t2)" }}>
            Subject
          </label>
          <input
            type="text"
            placeholder="Subject..."
            style={{
              width: "100%",
              padding: "8px 12px",
              marginTop: "4px",
              border: "1px solid var(--r-bd)",
              borderRadius: "6px",
              backgroundColor: "var(--r-bg)",
              color: "var(--r-t1)",
              fontSize: "13px",
            }}
          />
        </div>

        {/* Body Field */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--r-t2)" }}>
            Message
          </label>
          <textarea
            placeholder="Type your message..."
            style={{
              width: "100%",
              minHeight: "120px",
              padding: "10px 12px",
              marginTop: "4px",
              border: "1px solid var(--r-bd)",
              borderRadius: "6px",
              backgroundColor: "var(--r-bg)",
              color: "var(--r-t1)",
              fontSize: "13px",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--r-bd)",
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={() => dispatch({ type: "setComposing", payload: false })}
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
          Discard
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: "setComposing", payload: false })}
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
  );
}
