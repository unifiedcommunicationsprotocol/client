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
        className="fixed inset-0 z-[98] border-0 p-0 cursor-pointer bg-none"
        aria-label="Close menu"
      />
      <div
        className="fixed left-[60px] bottom-[10px] w-56 bg-[var(--r-sf)] rounded-lg border border-[var(--r-bd)] z-[99] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      >
        {/* User Info */}
        <div className="px-[14px] py-3 border-b border-b-[var(--r-bd)]">
          <div className="text-xs font-semibold text-[var(--r-t1)]">
            You
          </div>
          <div className="text-[11px] text-[var(--r-t3)] mt-0.5">
            you@relay.im
          </div>
        </div>

        {/* Menu Items */}
        <div>
          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={() => dispatch({ type: "toggleDarkMode" })}
            className="w-full px-[14px] py-[9px] bg-transparent border-0 text-left text-[13px] text-[var(--r-t1)] cursor-pointer flex items-center justify-between transition-colors duration-150 hover:bg-[var(--r-hov)]"
          >
            <span>{state.darkMode ? "Light mode" : "Dark mode"}</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={() =>
              dispatch({ type: "setView", payload: "settings/appearance" })
            }
            className="w-full px-[14px] py-[9px] bg-transparent border-0 text-left text-[13px] text-[var(--r-t1)] cursor-pointer transition-colors duration-150 border-t border-t-[var(--r-bd)] hover:bg-[var(--r-hov)]"
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
            className="w-full px-[14px] py-[9px] bg-transparent border-0 text-left text-[13px] text-[var(--r-t1)] cursor-pointer transition-colors duration-150 hover:bg-[var(--r-hov)]"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}
