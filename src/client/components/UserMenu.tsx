import { useAppContext } from "../AppContext";

interface UserMenuProps {
  onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const { state, dispatch } = useAppContext();

  return (
    <div
      style={{
        position: "absolute",
        bottom: "60px",
        right: "8px",
        width: "240px",
        backgroundColor: "var(--r-sf)",
        borderRadius: "8px",
        border: "1px solid var(--r-bd)",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        overflow: "hidden",
      }}
    >
      {/* User Info */}
      <div style={{ padding: "16px", borderBottom: "1px solid var(--r-bd)" }}>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
          You
        </div>
        <div style={{ fontSize: "12px", color: "var(--r-t3)", marginTop: "4px" }}>
          you@relay.im
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: "8px 0" }}>
        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: "toggleDarkMode" })}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "transparent",
            border: "none",
            textAlign: "left",
            fontSize: "13px",
            color: "var(--r-t1)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "background-color 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          <span>{state.darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "setShowUserMenu", payload: false });
            onLogout();
          }}
          style={{
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "transparent",
            border: "none",
            textAlign: "left",
            fontSize: "13px",
            color: "var(--r-t1)",
            cursor: "pointer",
            transition: "background-color 150ms",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
