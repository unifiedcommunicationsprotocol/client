import { useAppContext } from "../AppContext";

interface SettingsSidebarProps {
  onLogout: () => void;
}

export function SettingsSidebar({ onLogout }: SettingsSidebarProps) {
  const { state, dispatch } = useAppContext();

  const categories = [
    {
      id: "account",
      label: "ACCOUNT",
      items: [
        { id: "appearance", label: "Appearance" },
        { id: "notifications", label: "Notifications" },
        { id: "preferences", label: "Preferences" },
      ],
    },
    {
      id: "privacy",
      label: "PRIVACY & SECURITY",
      items: [
        { id: "identity", label: "Identity" },
        { id: "keys", label: "Keys" },
        { id: "read_receipts", label: "Read receipts" },
        { id: "ext_images", label: "External images" },
      ],
    },
    {
      id: "bridges",
      label: "INTEGRATIONS",
      items: [
        { id: "email_bridge", label: "Email bridge" },
        { id: "calendar_bridge", label: "Calendar bridge" },
        { id: "contacts_bridge", label: "Contacts bridge" },
      ],
    },
  ];

  return (
    <div className="w-55 bg-[var(--r-sf)] border-r border-[var(--r-bd)] overflow-auto flex flex-col">
      {/* Settings title */}
      <div className="px-5 py-4 border-b border-[var(--r-bd)] flex-shrink-0">
        <h2 className="text-base font-semibold text-[var(--r-t1)] m-0">
          Settings
        </h2>
      </div>

      {/* Menu items */}
      <div className="flex-1 overflow-auto py-3">
        {categories.map((category) => (
          <div key={category.id}>
            {/* Category header */}
            <div className="px-5 py-2 text-xs font-semibold text-[var(--r-t3)] uppercase tracking-wider">
              {category.label}
            </div>

            {/* Category items */}
            <div className="flex flex-col gap-0.5">
              {category.items.map((item) => {
                const isActive = state.settingsSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      dispatch({ type: "setSettingsSection", payload: item.id })
                    }
                    className={`mx-2 px-5 py-2 rounded-md text-sm text-left transition-colors ${
                      isActive
                        ? "bg-[var(--r-sel)] text-[var(--r-t1)] font-medium"
                        : "bg-transparent text-[var(--r-t2)] font-normal hover:bg-[var(--r-hov)]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Logout button */}
      <div className="p-3 border-t border-[var(--r-bd)] flex-shrink-0">
        <button
          type="button"
          onClick={onLogout}
          className="w-full px-3 py-2 border border-[var(--r-bd)] rounded-md bg-transparent text-[var(--r-t2)] cursor-pointer text-xs font-medium hover:bg-[var(--r-hov)]"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
