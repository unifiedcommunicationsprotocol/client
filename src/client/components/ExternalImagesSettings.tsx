import { useAppContext } from "../AppContext";

export function ExternalImagesSettings() {
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
          External images
        </h2>
        <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
          Privacy controls for remote image loading
        </p>
      </div>

      {/* Auto-load external images */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--r-bd)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--r-t1)",
              marginBottom: "4px",
            }}
          >
            Auto-load external images
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--r-t3)",
              lineHeight: "1.5",
            }}
          >
            External image URLs can be used to track when and where you opened a
            message. Off by default.
          </p>
        </div>
        <input
          type="checkbox"
          checked={state.extImages}
          onChange={(e) =>
            dispatch({ type: "setExtImages", payload: e.target.checked })
          }
          style={{
            width: "36px",
            height: "20px",
            cursor: "pointer",
            accentColor: "var(--r-acc)",
            marginLeft: "16px",
            marginTop: "2px",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Always allow from Relay contacts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--r-bd)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--r-t1)",
              marginBottom: "4px",
            }}
          >
            Always allow from Relay contacts
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--r-t3)",
              lineHeight: "1.5",
            }}
          >
            Load images sent by contacts on Relay (E2E only)
          </p>
        </div>
        <input
          type="checkbox"
          defaultChecked
          style={{
            width: "36px",
            height: "20px",
            cursor: "pointer",
            accentColor: "var(--r-acc)",
            marginLeft: "16px",
            marginTop: "2px",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Info box */}
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
          In Blocks rendering mode,
        </strong>{" "}
        external images are never auto-loaded. This applies to HTML messages via
        the email bridge only.
      </div>
    </div>
  );
}
