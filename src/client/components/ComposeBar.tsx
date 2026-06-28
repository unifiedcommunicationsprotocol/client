import { useState } from "react";
import { useAppContext } from "../AppContext";

export function ComposeBar() {
  const { state, dispatch } = useAppContext();
  const [textareaHeight, setTextareaHeight] = useState(40);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch({ type: "setMsgInputText", payload: e.target.value });

    // Auto-resize textarea
    e.target.style.height = "auto";
    const scrollHeight = Math.max(40, Math.min(e.target.scrollHeight, 200));
    setTextareaHeight(scrollHeight);
    e.target.style.height = `${scrollHeight}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (state.msgInputText.trim()) {
      console.log("Sending message:", state.msgInputText);
      // TODO: POST to API
      dispatch({ type: "setMsgInputText", payload: "" });
      setTextareaHeight(40);
    }
  };

  const handleFileClick = () => {
    dispatch({ type: "setMsgShowFileModal", payload: true });
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--r-bd)",
        backgroundColor: "var(--r-bg)",
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        flexShrink: 0,
      }}
    >
      {/* Paperclip Button */}
      <button
        type="button"
        onClick={handleFileClick}
        style={{
          width: "28px",
          height: "28px",
          padding: "0",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "transparent",
          color: "var(--r-t2)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          flexShrink: 0,
        }}
        title="Attach file"
      >
        📎
      </button>

      {/* Textarea */}
      <textarea
        value={state.msgInputText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        style={{
          flex: 1,
          padding: "8px 12px",
          fontSize: "13px",
          border: "1px solid var(--r-bd)",
          borderRadius: "6px",
          backgroundColor: "var(--r-sf)",
          color: "var(--r-t1)",
          fontFamily: "inherit",
          resize: "none",
          height: `${textareaHeight}px`,
          minHeight: "40px",
          maxHeight: "200px",
          lineHeight: "1.4",
        }}
      />

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!state.msgInputText.trim()}
        style={{
          width: "28px",
          height: "28px",
          padding: "0",
          border: "none",
          borderRadius: "4px",
          backgroundColor: state.msgInputText.trim()
            ? "var(--r-acc)"
            : "var(--r-bd)",
          color: "white",
          cursor: state.msgInputText.trim() ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          flexShrink: 0,
        }}
        title="Send message"
      >
        ➜
      </button>
    </div>
  );
}
