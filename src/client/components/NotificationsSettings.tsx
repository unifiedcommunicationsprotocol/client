import { useAppContext } from "../AppContext";

export function NotificationsSettings() {
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
          Notifications
        </h2>
        <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
          Manage how and when you receive alerts
        </p>
      </div>

      {/* Push notifications */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
              marginBottom: "2px",
            }}
          >
            Push notifications
          </div>
          <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
            Receive alerts for new messages
          </p>
        </div>
        <input
          type="checkbox"
          checked={state.notifBadge}
          onChange={(e) =>
            dispatch({ type: "setNotifBadge", payload: e.target.checked })
          }
          style={{
            width: "36px",
            height: "20px",
            cursor: "pointer",
            accentColor: "var(--r-acc)",
          }}
        />
      </div>

      {/* Sound alerts */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
              marginBottom: "2px",
            }}
          >
            Sound alerts
          </div>
          <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
            Play a sound for new messages
          </p>
        </div>
        <input
          type="checkbox"
          checked={state.notifSound}
          onChange={(e) =>
            dispatch({ type: "setNotifSound", payload: e.target.checked })
          }
          style={{
            width: "36px",
            height: "20px",
            cursor: "pointer",
            accentColor: "var(--r-acc)",
          }}
        />
      </div>

      {/* Badge count */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--r-t1)",
              marginBottom: "2px",
            }}
          >
            Badge count
          </div>
          <p style={{ fontSize: "13px", color: "var(--r-t3)" }}>
            Show unread count on app icon
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
          }}
        />
      </div>
    </div>
  );
}
