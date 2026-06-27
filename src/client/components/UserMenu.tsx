import { useAppContext } from "../AppContext";

interface UserMenuProps {
  onLogout: () => void;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const { state, dispatch } = useAppContext();

  return (
    <>
      <button
        type="button"
        onClick={() => dispatch({ type: "setShowUserMenu", payload: false })}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 98,
          border: "none",
          padding: "0",
          background: "none",
          cursor: "pointer",
        }}
        aria-label="Close menu"
      />
      <div
        style={{
          position: "fixed",
          left: "60px",
          bottom: "10px",
          width: "224px",
          backgroundColor: "var(--r-sf)",
          borderRadius: "8px",
          border: "1px solid var(--r-bd)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.35)",
          zIndex: 99,
          overflow: "hidden",
        }}
      >
        {/* User Info */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--r-bd)" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--r-t1)" }}>
            You
          </div>
          <div style={{ fontSize: "11px", color: "var(--r-t3)", marginTop: "2px" }}>
            you@relay.im
          </div>
        </div>

        {/* Menu Items */}
        <div>
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => dispatch({ type: "toggleDarkMode" })}
            style={{
              width: "100%",
              padding: "9px 14px",
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
            <span>{state.darkMode ? "Light mode" : "Dark mode"}</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() => dispatch({ type: "setView", payload: "settings/appearance" })}
            style={{
              width: "100%",
              padding: "9px 14px",
              backgroundColor: "transparent",
              border: "none",
              textAlign: "left",
              fontSize: "13px",
              color: "var(--r-t1)",
              cursor: "pointer",
              transition: "background-color 150ms",
              borderTop: "1px solid var(--r-bd)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            Settings
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
              padding: "9px 14px",
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
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
