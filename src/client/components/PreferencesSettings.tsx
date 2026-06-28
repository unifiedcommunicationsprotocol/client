import { useAppContext } from "../AppContext";

export function PreferencesSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Preferences
        </h2>
        <p className="text-sm text-[var(--r-t3)]">Customize how content is displayed</p>
      </div>

      {/* Message rendering */}
      <div>
        <div className="text-sm font-medium text-[var(--r-t1)] mb-3 block">
          Message rendering
        </div>
        <div className="flex gap-2 mb-3">
          {[
            { id: "blocks", label: "Blocks" },
            { id: "html", label: "HTML" },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() =>
                dispatch({
                  type: "setRenderingMode",
                  payload: mode.id as "blocks" | "html",
                })
              }
              className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                state.renderingMode === mode.id
                  ? "bg-[var(--r-accd)] text-[var(--r-acc)]"
                  : "border border-[var(--r-bd)] bg-transparent text-[var(--r-t2)]"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div className="p-3 rounded-md bg-[var(--r-accd)] border border-[rgba(99,102,241,0.2)] text-xs text-[var(--r-t2)] leading-relaxed">
          <strong className="text-[var(--r-t1)]">Blocks mode:</strong> Messages are stripped of HTML and rendered as plain text blocks. This is the default and most secure mode.
        </div>
      </div>

      {/* AI metadata language */}
      <div>
        <div className="text-sm font-medium text-[var(--r-t1)] mb-3 block">
          AI metadata language
        </div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {[
            { id: "EN", label: "EN" },
            { id: "FR", label: "FR" },
            { id: "DE", label: "DE" },
            { id: "ES", label: "ES" },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              className="px-4 py-2 rounded-md border border-[var(--r-bd)] bg-transparent text-xs font-medium text-[var(--r-t2)] cursor-pointer transition-all"
            >
              {lang.label}
            </button>
          ))}
        </div>
        <div className="p-3 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)] text-xs text-[var(--r-t2)] leading-relaxed">
          <strong className="text-[var(--r-t1)]">AI metadata is always generated locally on your device.</strong> It is never sent to Relay servers or external services.
        </div>
      </div>
    </div>
  );
}
