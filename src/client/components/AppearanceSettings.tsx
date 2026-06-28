import { useAppContext } from "../AppContext";

export function AppearanceSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "var(--r-t1)",
          margin: "0 0 24px 0",
        }}
      >
        Appearance
      </h1>

      {/* Theme */}
      <div
        style={{
          backgroundColor: "var(--r-sf)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "8px",
            color: "var(--r-t1)",
          }}
        >
          Color scheme
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--r-t2)",
            marginBottom: "12px",
          }}
        >
          Light or dark theme
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              if (state.darkMode) {
                dispatch({ type: "toggleDarkMode" });
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: state.darkMode ? "1px solid var(--r-bd)" : "none",
              backgroundColor: state.darkMode ? "var(--r-bg)" : "var(--r-acc)",
              color: state.darkMode ? "var(--r-t1)" : "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
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
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: !state.darkMode ? "1px solid var(--r-bd)" : "none",
              backgroundColor: !state.darkMode ? "var(--r-bg)" : "var(--r-acc)",
              color: !state.darkMode ? "var(--r-t1)" : "white",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Dark
          </button>
        </div>
      </div>

      {/* AI category badges */}
      <div
        style={{
          backgroundColor: "var(--r-sf)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "4px",
              color: "var(--r-t1)",
            }}
          >
            AI category badges
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--r-t2)",
            }}
          >
            Show category and source tags in thread list
          </div>
        </div>
        <input
          type="checkbox"
          defaultChecked
          style={{
            width: "36px",
            height: "20px",
            cursor: "pointer",
            accentColor: "var(--r-acc)",
          }}
        />
      </div>

      {/* Thread density */}
      <div
        style={{
          backgroundColor: "var(--r-sf)",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "8px",
            color: "var(--r-t1)",
          }}
        >
          Thread density
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "var(--r-t2)",
            marginBottom: "12px",
          }}
        >
          Compact or spacious thread list
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => {
              if (state.variant !== "A") {
                dispatch({ type: "setVariant", payload: "A" });
              }
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: state.variant === "A" ? "none" : "1px solid var(--r-bd)",
              backgroundColor:
                state.variant === "A" ? "var(--r-acc)" : "var(--r-bg)",
              color: state.variant === "A" ? "white" : "var(--r-t1)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
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
            style={{
              padding: "8px 16px",
              borderRadius: "6px",
              border: state.variant === "B" ? "none" : "1px solid var(--r-bd)",
              backgroundColor:
                state.variant === "B" ? "var(--r-acc)" : "var(--r-bg)",
              color: state.variant === "B" ? "white" : "var(--r-t1)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Spacious
          </button>
        </div>
      </div>
    </div>
  );
}
