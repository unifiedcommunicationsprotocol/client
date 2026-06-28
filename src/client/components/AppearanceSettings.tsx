import { useAppContext } from "../AppContext";

export function AppearanceSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Appearance
        </h2>
        <p className="text-sm text-[var(--r-t3)]">Customize your visual preferences</p>
      </div>

      {/* Color scheme */}
      <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)]">
        <div className="text-sm font-medium text-[var(--r-t1)] mb-2">
          Color scheme
        </div>
        <div className="text-xs text-[var(--r-t2)] mb-3">
          Light or dark theme
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (state.darkMode) {
                dispatch({ type: "toggleDarkMode" });
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-all ${
              state.darkMode
                ? "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
                : "bg-[var(--r-acc)] text-white"
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => {
              if (!state.darkMode) {
                dispatch({ type: "toggleDarkMode" });
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-all ${
              !state.darkMode
                ? "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
                : "bg-[var(--r-acc)] text-white"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      {/* AI category badges */}
      <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)] flex justify-between items-center">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-1">
            AI category badges
          </div>
          <div className="text-xs text-[var(--r-t2)]">
            Show category and source tags in thread list
          </div>
        </div>
        <input
          type="checkbox"
          defaultChecked
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)]"
        />
      </div>

      {/* Thread density */}
      <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)]">
        <div className="text-sm font-medium text-[var(--r-t1)] mb-2">
          Thread density
        </div>
        <div className="text-xs text-[var(--r-t2)] mb-3">
          Compact or spacious thread list
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (state.variant !== "A") {
                dispatch({ type: "setVariant", payload: "A" });
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-all ${
              state.variant === "A"
                ? "bg-[var(--r-acc)] text-white"
                : "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
            }`}
          >
            Compact
          </button>
          <button
            type="button"
            onClick={() => {
              if (state.variant !== "B") {
                dispatch({ type: "setVariant", payload: "B" });
              }
            }}
            className={`flex-1 px-4 py-2 rounded-md text-xs font-medium transition-all ${
              state.variant === "B"
                ? "bg-[var(--r-acc)] text-white"
                : "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
            }`}
          >
            Spacious
          </button>
        </div>
      </div>
    </div>
  );
}
