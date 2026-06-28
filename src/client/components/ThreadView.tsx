import { useAppContext } from "../AppContext";
import { THREAD_MSGS, THREADS } from "../data";
import { Icon } from "./Icon";

export function ThreadView() {
  const { state, dispatch } = useAppContext();

  const selectedThread = THREADS.find((t) => t.id === state.selectedThread);
  const threadMessages = state.selectedThread
    ? THREAD_MSGS[state.selectedThread] || []
    : [];

  if (!selectedThread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-[var(--r-t3)] text-center">
        <div>
          <div className="text-6xl mb-4">
            <Icon name="email" size={48} />
          </div>
          <div className="text-base font-medium mb-2">No thread selected</div>
          <div className="text-sm text-[var(--r-t3)]">
            Select a thread from the sidebar to view messages
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Thread Header */}
      <div className="border-b border-[var(--r-bd)] px-5 py-4 bg-[var(--r-bg)]">
        <h2 className="text-base font-semibold mb-1 text-[var(--r-t1)]">
          {selectedThread.subject}
        </h2>
        <div className="text-xs text-[var(--r-t2)]">{selectedThread.from}</div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {threadMessages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg border-l-4 ${
              msg.from === "you@relay.im"
                ? "bg-[var(--r-sel)] border-[var(--r-acc)]"
                : "bg-[var(--r-sf)] border-[var(--r-bd)]"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-sm text-[var(--r-t1)]">
                {msg.from === "you@relay.im" ? "You" : msg.from}
              </div>
              <div className="text-xs text-[var(--r-t3)]">{msg.timestamp}</div>
            </div>
            <div className="text-sm text-[var(--r-t1)] leading-relaxed">
              {msg.body}
            </div>
            {msg.encrypted && (
              <div className="flex items-center gap-1.5 text-[10px] text-[var(--r-safe)] mt-2">
                <Icon name="check" size={12} />
                Encrypted end-to-end
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply/Forward Compose Area */}
      {state.replyOpen ? (
        <div className="border-t border-[var(--r-bd)] p-4 bg-[var(--r-bg)]">
          <div className="mb-3 text-xs text-[var(--r-t2)]">
            {state.replyIsForward ? "Forwarding to:" : "Replying to:"}{" "}
            {state.replyTo}
            {state.replyShowCc && state.replyCc && `, ${state.replyCc}`}
            {state.replyShowBcc && state.replyBcc && `, ${state.replyBcc}`}
          </div>
          <textarea
            value={state.replyText}
            onChange={(e) =>
              dispatch({ type: "setReplyText", payload: e.target.value })
            }
            placeholder="Type your reply..."
            className="w-full min-h-[100px] mb-3 font-inherit p-2.5 border border-[var(--r-bd)] rounded-md bg-[var(--r-sf)] text-[var(--r-t1)] text-sm resize-vertical"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => dispatch({ type: "setReplyOpen", payload: false })}
              className="px-4 py-2 rounded-md border border-[var(--r-bd)] bg-transparent text-[var(--r-t1)] cursor-pointer text-xs font-medium"
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
                        subject: state.replyIsForward
                          ? `Fwd: ${selectedThread.subject}`
                          : `Re: ${selectedThread.subject}`,
                        body: state.replyText,
                        encrypted: true,
                      },
                    },
                  });
                  dispatch({ type: "setReplyText", payload: "" });
                  dispatch({ type: "setReplyOpen", payload: false });
                }
              }}
              className="px-4 py-2 rounded-md border-none bg-[var(--r-acc)] text-white cursor-pointer text-xs font-medium"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[var(--r-bd)] p-4 bg-[var(--r-bg)] flex gap-2">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "setReplyOpen", payload: true });
              dispatch({ type: "setReplyIsForward", payload: false });
              dispatch({ type: "setReplyTo", payload: selectedThread.from });
            }}
            className="px-4 py-2 rounded-md border border-[var(--r-bd)] bg-transparent text-[var(--r-t1)] cursor-pointer text-xs font-medium"
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
            className="px-4 py-2 rounded-md border border-[var(--r-bd)] bg-transparent text-[var(--r-t1)] cursor-pointer text-xs font-medium"
          >
            Forward
          </button>
        </div>
      )}
    </div>
  );
}
