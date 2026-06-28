import { useAppContext } from "../AppContext";
import { MSG_CHANNELS, MSG_DMS } from "../data";
import { ComposeBar } from "./ComposeBar";

export function MessageThread() {
  const { state } = useAppContext();

  const selectedChannelId = state.selectedChannel;
  const selectedDmId = state.selectedDM;

  // Find channel/DM info
  const channel = selectedChannelId
    ? MSG_CHANNELS.find((c) => c.id === selectedChannelId)
    : null;
  const dm = selectedDmId ? MSG_DMS.find((d) => d.id === selectedDmId) : null;

  const isChannel = !!channel;
  const isDm = !!dm;
  const name = channel?.name || dm?.name || "";
  const avatar = dm?.avatar || null;
  const color = dm?.color || null;

  // Get messages for selected channel/DM
  const messages = selectedChannelId
    ? state.customChanMsgs[selectedChannelId] || []
    : selectedDmId
      ? state.customChanMsgs[selectedDmId] || []
      : [];

  if (!selectedChannelId && !selectedDmId) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--r-t3)",
          textAlign: "center",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
          <div
            style={{ fontSize: "16px", fontWeight: "500", marginBottom: "8px" }}
          >
            No channel or message selected
          </div>
          <div style={{ fontSize: "14px", color: "var(--r-t3)" }}>
            Select a channel or direct message to view conversations
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid var(--r-bd)",
          padding: "16px 20px",
          backgroundColor: "var(--r-bg)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isDm && avatar && color && (
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: "600",
                color: "white",
              }}
            >
              {avatar}
            </div>
          )}

          <div>
            <h2
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--r-t1)",
                margin: "0 0 4px 0",
              }}
            >
              {isChannel ? `# ${name}` : name}
            </h2>
            {isDm && (
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--r-t3)",
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                @{name.toLowerCase().replace(" ", ".")}
              </div>
            )}
          </div>
        </div>

        {/* E2E Badge */}
        {isChannel && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#22C55E",
              fontWeight: "500",
            }}
          >
            🔒 End-to-end encrypted
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--r-t3)",
              fontSize: "14px",
            }}
          >
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => {
            const prevMsg = idx > 0 ? messages[idx - 1] : null;
            const sameSender = prevMsg?.from === msg.from;

            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: sameSender ? "-12px" : "0",
                }}
              >
                {!sameSender ? (
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      backgroundColor: "#818CF8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "white",
                      flexShrink: 0,
                      marginTop: "4px",
                    }}
                  >
                    {msg.from
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </div>
                ) : (
                  <div style={{ width: "28px", flexShrink: 0 }} />
                )}

                <div style={{ flex: 1 }}>
                  {!sameSender && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--r-t1)",
                        }}
                      >
                        {msg.from}
                      </span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--r-t3)",
                        }}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  )}

                  <div
                    style={{
                      fontSize: "13.5px",
                      color: "var(--r-t1)",
                      lineHeight: "1.6",
                      paddingLeft: "0px",
                    }}
                  >
                    {msg.body}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Compose Bar */}
      <ComposeBar />
    </div>
  );
}
