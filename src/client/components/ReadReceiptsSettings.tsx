import { useAppContext } from "../AppContext";

export function ReadReceiptsSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Read receipts
        </h2>
        <p className="text-sm text-[var(--r-t3)]">Control message read status notifications</p>
      </div>

      {/* Send read receipts */}
      <div className="flex justify-between items-start pb-4 border-b border-[var(--r-bd)]">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-1">
            Send read receipts
          </div>
          <p className="text-xs text-[var(--r-t3)] leading-relaxed">
            Senders who request a receipt will see when you open their message. Off by default.
          </p>
        </div>
        <input
          type="checkbox"
          checked={state.readReceipts}
          onChange={(e) => dispatch({ type: "setReadReceipts", payload: e.target.checked })}
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)] ml-4 mt-0.5 flex-shrink-0"
        />
      </div>

      {/* Info box */}
      <div className="p-3 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)] text-xs text-[var(--r-t2)] leading-relaxed">
        <strong className="text-[var(--r-t1)]">Read receipts are opt-in.</strong> They are structurally explicit in the UCP protocol — read receipts are cryptographically tied to message delivery and verification.
      </div>
    </div>
  );
}
