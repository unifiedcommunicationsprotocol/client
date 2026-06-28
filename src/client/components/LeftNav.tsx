import { useState } from "react";
import { useAppContext } from "../AppContext";
import { Icon } from "./Icon";

export function LeftNav() {
  const { state, dispatch } = useAppContext();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: "inbox", label: "Inbox" },
    { id: "messaging", label: "Messages" },
    { id: "calendar", label: "Calendar" },
    { id: "contacts", label: "Contacts" },
    { id: "notes", label: "Notes" },
    { id: "agents", label: "Agents" },
  ];

  const isActive = (viewId: string) => state.view === viewId;

  return (
    <nav
      style={{
        width: "52px",
        backgroundColor: "var(--r-sf)",
        borderRight: "1px solid var(--r-bd)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 6px",
        overflowY: "auto",
        flexShrink: 0,
      }}
    >
      {/* Top section: Navigation buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dispatch({ type: "setView", payload: item.id })}
            title={item.label}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isActive(item.id)
                ? "var(--r-accd)"
                : "transparent",
              color: isActive(item.id) ? "var(--r-acc)" : "var(--r-t2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 80ms, color 80ms",
              fontSize: "18px",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.id)) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.id)) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }
            }}
          >
            {getNavIcon(item.id)}
          </button>
        ))}
      </div>

      {/* Bottom section: Settings + User avatar */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <button
          type="button"
          onClick={() =>
            dispatch({ type: "setView", payload: "settings/appearance" })
          }
          title="Settings"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: state.view.startsWith("settings")
              ? "var(--r-accd)"
              : "transparent",
            color: state.view.startsWith("settings")
              ? "var(--r-acc)"
              : "var(--r-t2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 80ms, color 80ms",
            fontSize: "18px",
          }}
          onMouseEnter={(e) => {
            if (!state.view.startsWith("settings")) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--r-hov)";
            }
          }}
          onMouseLeave={(e) => {
            if (!state.view.startsWith("settings")) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }
          }}
        >
          <Icon name="settings" size={18} />
        </button>

        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            title="User menu"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#4F46E5",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: "700",
              transition: "opacity 80ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            Y
          </button>

          {/* User dropdown menu */}
          {showUserMenu && (
            <>
              <div
                onClick={() => setShowUserMenu(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 98,
                }}
              />
              <div
                style={{
                  position: "fixed",
                  left: "60px",
                  bottom: "12px",
                  width: "200px",
                  backgroundColor: "var(--r-sf)",
                  border: "1px solid var(--r-bd)",
                  borderRadius: "8px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                  zIndex: 99,
                  overflow: "hidden",
                  animation: "fadeUp 0.15s ease",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "12px 14px",
                    borderBottom: "1px solid var(--r-bd)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "var(--r-t1)",
                      marginBottom: "2px",
                    }}
                  >
                    You
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--r-t3)",
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    you@relay.im
                  </div>
                </div>

                {/* Theme toggle */}
                <div
                  onClick={() => dispatch({ type: "toggleDarkMode" })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 14px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--r-t1)",
                    borderBottom: "1px solid var(--r-bd)",
                    transition: "background 80ms",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--r-hov)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <span>
                    {state.darkMode ? (
                      <>
                        <Icon name="moon" size={12} /> Dark
                      </>
                    ) : (
                      <>
                        <Icon name="sun" size={12} /> Light
                      </>
                    )}
                  </span>
                </div>

                {/* Settings link */}
                <div
                  onClick={() => {
                    dispatch({
                      type: "setView",
                      payload: "settings/appearance",
                    });
                    setShowUserMenu(false);
                  }}
                  style={{
                    padding: "9px 14px",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--r-t1)",
                    transition: "background 80ms",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "var(--r-hov)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  Settings
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function getNavIcon(viewId: string): React.ReactNode {
  const iconProps = { width: 20, height: 20, viewBox: "0 0 24 24" };

  switch (viewId) {
    case "inbox":
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
          <path d="M2 6l10 7 10-7" />
        </svg>
      );
    case "messaging":
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      );
    case "contacts":
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
        </svg>
      );
    case "notes":
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
          <path d="M7 9h10M7 13h10M7 17h5" />
        </svg>
      );
    case "agents":
      return (
        <svg {...iconProps} fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6M17 19v-6a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v6M13 9a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" />
        </svg>
      );
    default:
      return <Icon name="dot" size={14} />;
  }
}
