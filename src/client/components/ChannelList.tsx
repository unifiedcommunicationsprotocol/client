import { useAppContext } from "../AppContext";
import { MSG_CHANNELS, MSG_DMS } from "../data";

export function ChannelList() {
  const { state, dispatch } = useAppContext();

  const handleChannelClick = (id: string) => {
    dispatch({ type: "selectChannel", payload: id });
  };

  const handleDmClick = (id: string) => {
    dispatch({ type: "selectDM", payload: id });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Channels Section */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Channels Header */}
        <div
          style={{
            padding: "12px 12px 8px",
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--r-t3)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          Channels
        </div>

        {/* Channel Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {MSG_CHANNELS.map((channel) => {
            const isSelected = state.selectedChannel === channel.id;
            const unreadCount = 0; // TODO: track per channel

            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => handleChannelClick(channel.id)}
                style={{
                  padding: "7px 8px",
                  margin: "0 8px",
                  backgroundColor: isSelected ? "var(--r-sel)" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: isSelected ? "var(--r-t1)" : "var(--r-t2)",
                    fontWeight: isSelected ? "500" : "400",
                  }}
                >
                  # {channel.name}
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      backgroundColor: "var(--r-acc)",
                      color: "white",
                      padding: "1px 5px",
                      borderRadius: "8px",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Direct Messages Header */}
        <div
          style={{
            padding: "12px 12px 8px",
            marginTop: "12px",
            fontSize: "10px",
            fontWeight: "600",
            color: "var(--r-t3)",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          Direct messages
        </div>

        {/* DM Rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {MSG_DMS.map((dm) => {
            const isSelected = state.selectedDM === dm.id;

            return (
              <button
                key={dm.id}
                type="button"
                onClick={() => handleDmClick(dm.id)}
                style={{
                  padding: "7px 8px",
                  margin: "0 8px",
                  backgroundColor: isSelected ? "var(--r-sel)" : "transparent",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "flex-start",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: dm.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: "600",
                    color: "white",
                    flexShrink: 0,
                  }}
                >
                  {dm.avatar}
                </div>

                {/* Name */}
                <span
                  style={{
                    fontSize: "13px",
                    color: isSelected ? "var(--r-t1)" : "var(--r-t2)",
                    fontWeight: isSelected ? "500" : "400",
                    flex: 1,
                    textAlign: "left",
                  }}
                >
                  {dm.name}
                </span>

                {/* Online Indicator */}
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#22C55E",
                    flexShrink: 0,
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
