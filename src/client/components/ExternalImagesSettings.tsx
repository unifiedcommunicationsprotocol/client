import { useAppContext } from "../AppContext";

export function ExternalImagesSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          External images
        </h2>
        <p className="text-sm text-[var(--r-t3)]">Privacy controls for remote image loading</p>
      </div>

      {/* Auto-load external images */}
      <div className="flex justify-between items-start pb-4 border-b border-[var(--r-bd)]">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-1">
            Auto-load external images
          </div>
          <p className="text-xs text-[var(--r-t3)] leading-relaxed">
            External image URLs can be used to track when and where you opened a message. Off by default.
          </p>
        </div>
        <input
          type="checkbox"
          checked={state.extImages}
          onChange={(e) => dispatch({ type: "setExtImages", payload: e.target.checked })}
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)] ml-4 mt-0.5 flex-shrink-0"
        />
      </div>

      {/* Always allow from Relay contacts */}
      <div className="flex justify-between items-start pb-4 border-b border-[var(--r-bd)]">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-1">
            Always allow from Relay contacts
          </div>
          <p className="text-xs text-[var(--r-t3)] leading-relaxed">
            Load images sent by contacts on Relay (E2E only)
          </p>
        </div>
        <input
          type="checkbox"
          defaultChecked
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)] ml-4 mt-0.5 flex-shrink-0"
        />
      </div>

      {/* Info box */}
      <div className="p-3 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)] text-xs text-[var(--r-t2)] leading-relaxed">
        <strong className="text-[var(--r-t1)]">In Blocks rendering mode,</strong> external images are never auto-loaded. This applies to HTML messages via the email bridge only.
      </div>
    </div>
  );
}
