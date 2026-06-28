import { useAppContext } from "../AppContext";

export function ReadReceiptsSettings() {
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
          Read receipts
        </h2>
        <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
          Control message read status notifications
        </p>
      </div>

      {/* Send read receipts */}
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
            Send read receipts
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--r-t3)",
              lineHeight: "1.5",
            }}
          >
            Senders who request a receipt will see when you open their message.
            Off by default.
          </p>
        </div>
        <input
          type="checkbox"
          checked={state.readReceipts}
          onChange={(e) =>
            dispatch({ type: "setReadReceipts", payload: e.target.checked })
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
          Read receipts are opt-in.
        </strong>{" "}
        They are structurally explicit in the UCP protocol — read receipts are
        cryptographically tied to message delivery and verification.
      </div>
    </div>
  );
}
