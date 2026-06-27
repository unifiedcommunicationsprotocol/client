import { useAppContext } from "../AppContext";
import { MSG_CHANNELS, MSG_DMS } from "../data";

export function MessagesPanel() {
  const { state, dispatch } = useAppContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "11px 12px 9px",
          borderBottom: "1px solid var(--r-bd)",
          flexShrink: 0,
        }}
      >
        <span
          style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}
        >
          Messages
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
        {/* Channels */}
        <div
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--r-t3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "4px 8px 5px",
          }}
        >
          Channels
        </div>
        {MSG_CHANNELS.map((chan) => (
          <button
            key={chan.id}
            type="button"
            onClick={() =>
              dispatch({ type: "selectChannel", payload: chan.id })
            }
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              marginBottom: "2px",
              border: "none",
              backgroundColor:
                state.selectedChannel === chan.id
                  ? "var(--r-sel)"
                  : "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 200ms",
            }}
            onMouseEnter={(e) => {
              if (state.selectedChannel !== chan.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.selectedChannel !== chan.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }
            }}
          >
            <span
              style={{
                color: "var(--r-t3)",
                fontSize: "14px",
                fontWeight: "300",
              }}
            >
              #
            </span>
            <span>{chan.name}</span>
          </button>
        ))}

        {/* Direct Messages */}
        <div
          style={{
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--r-t3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "10px 8px 5px",
            borderTop: "1px solid var(--r-bd)",
            marginTop: "6px",
          }}
        >
          Direct
        </div>
        {MSG_DMS.map((dm) => (
          <button
            key={dm.id}
            type="button"
            onClick={() => dispatch({ type: "selectDM", payload: dm.id })}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 12px",
              marginBottom: "2px",
              border: "none",
              backgroundColor:
                state.selectedDM === dm.id ? "var(--r-sel)" : "transparent",
              color: "var(--r-t1)",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "background-color 200ms",
            }}
            onMouseEnter={(e) => {
              if (state.selectedDM !== dm.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.selectedDM !== dm.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                backgroundColor: dm.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "600",
                color: "white",
              }}
            >
              {dm.avatar}
            </div>
            <span>{dm.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
