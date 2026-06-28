import { useState } from "react";
import { useAppContext } from "../AppContext";
import { Icon } from "./Icon";

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
    <div className="px-4 py-3 border-t border-[var(--r-bd)] bg-[var(--r-bg)] flex items-end gap-2 flex-shrink-0">
      {/* Paperclip Button */}
      <button
        type="button"
        onClick={handleFileClick}
        className="w-7 h-7 p-0 border-none rounded bg-transparent text-[var(--r-t2)] cursor-pointer flex items-center justify-center text-base flex-shrink-0 hover:bg-[var(--r-hov)]"
        title="Attach file"
      >
        <Icon name="paperclip" size={16} />
      </button>

      {/* Textarea */}
      <textarea
        value={state.msgInputText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 text-xs border border-[var(--r-bd)] rounded-md bg-[var(--r-sf)] text-[var(--r-t1)] resize-none min-h-10 max-h-50 leading-relaxed"
        style={{ height: `${textareaHeight}px` }}
      />

      {/* Send Button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={!state.msgInputText.trim()}
        className={`w-7 h-7 p-0 border-none rounded flex items-center justify-center text-sm font-medium flex-shrink-0 ${
          state.msgInputText.trim()
            ? "bg-[var(--r-acc)] text-white cursor-pointer hover:opacity-90"
            : "bg-[var(--r-bd)] text-gray-400 cursor-not-allowed"
        }`}
        title="Send message"
      >
        <Icon name="send" size={16} />
      </button>
    </div>
  );
}
