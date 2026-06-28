import { useAppContext } from "../AppContext";

export function PreferencesSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "4px",
            color: "var(--r-t1)",
          }}
        >
          Preferences
        </h2>
        <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
          Customize how content is displayed
        </p>
      </div>

      {/* Message rendering */}
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--r-t1)",
            marginBottom: "12px",
            display: "block",
          }}
        >
          Message rendering
        </div>
        <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
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
              style={{
                flex: 1,
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--r-bd)",
                background:
                  state.renderingMode === mode.id
                    ? "var(--r-accd)"
                    : "transparent",
                color:
                  state.renderingMode === mode.id
                    ? "var(--r-acc)"
                    : "var(--r-t2)",
                fontSize: "13px",
                fontWeight: state.renderingMode === mode.id ? 600 : 500,
                cursor: "pointer",
                transition: "all 120ms",
              }}
            >
              {mode.label}
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "12px",
            borderRadius: "6px",
            background: "var(--r-accd)",
            border: "1px solid rgba(99,102,241,0.2)",
            fontSize: "13px",
            color: "var(--r-t2)",
            lineHeight: "1.5",
          }}
        >
          <strong style={{ color: "var(--r-t1)" }}>Blocks mode:</strong>{" "}
          Messages are stripped of HTML and rendered as plain text blocks. This
          is the default and most secure mode.
        </div>
      </div>

      {/* AI metadata language */}
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--r-t1)",
            marginBottom: "12px",
            display: "block",
          }}
        >
          AI metadata language
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "12px",
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "EN", label: "EN" },
            { id: "FR", label: "FR" },
            { id: "DE", label: "DE" },
            { id: "ES", label: "ES" },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              style={{
                flex: "0 1 auto",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--r-bd)",
                background: "transparent",
                color: "var(--r-t2)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 120ms",
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <div
          style={{
            padding: "12px",
            borderRadius: "6px",
            background: "var(--r-sf)",
            border: "1px solid var(--r-bd)",
            fontSize: "13px",
            color: "var(--r-t2)",
            lineHeight: "1.5",
          }}
        >
          <strong style={{ color: "var(--r-t1)" }}>
            AI metadata is always generated locally on your device.
          </strong>{" "}
          It is never sent to Relay servers or external services.
        </div>
      </div>
    </div>
  );
}
