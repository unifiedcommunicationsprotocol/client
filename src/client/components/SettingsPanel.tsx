import { useAppContext } from "../AppContext";

interface SettingsPanelProps {
  onLogout: () => void;
}

export function SettingsPanel({ onLogout }: SettingsPanelProps) {
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
      label: "PRIVACY",
      items: [
        { id: "read_receipts", label: "Read receipts" },
        { id: "external_images", label: "External images" },
      ],
    },
    {
      id: "integrations",
      label: "INTEGRATIONS",
      items: [
        { id: "email_bridge", label: "Email bridge" },
        { id: "calendar_bridge", label: "Calendar bridge" },
        { id: "card_bridge", label: "Contacts bridge" },
      ],
    },
    {
      id: "setup",
      label: "SETUP",
      items: [{ id: "wizard", label: "Run setup wizard →" }],
    },
  ];

  const getSettingTitle = () => {
    for (const cat of categories) {
      for (const item of cat.items) {
        if (state.view === `settings/${item.id}`) {
          return item.label;
        }
      }
    }
    return "Appearance";
  };

  const renderContent = () => {
    if (state.view.startsWith("settings/appearance")) {
      return (
        <div>
          <h2 className="text-xl font-semibold mb-6 text-[var(--r-t1)]">
            Appearance
          </h2>
          <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)]">
            <div className="mb-5">
              <div className="text-sm font-medium mb-2 text-[var(--r-t1)]">
                Color scheme
              </div>
              <div className="text-xs text-[var(--r-t2)] mb-3">
                Light or dark
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (state.darkMode) {
                      dispatch({ type: "toggleDarkMode" });
                    }
                  }}
                  className={`px-4 py-2 rounded-md text-sm cursor-pointer ${
                    state.darkMode
                      ? "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
                      : "border-none bg-[var(--r-acc)] text-white"
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!state.darkMode) {
                      dispatch({ type: "toggleDarkMode" });
                    }
                  }}
                  className={`px-4 py-2 rounded-md text-sm cursor-pointer ${
                    !state.darkMode
                      ? "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
                      : "border-none bg-[var(--r-acc)] text-white"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className="mb-5">
              <div className="text-sm font-medium mb-2 text-[var(--r-t1)]">
                Thread list density
              </div>
              <div className="text-xs text-[var(--r-t2)] mb-3">
                Compact or spacious rows
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => dispatch({ type: "setVariant", payload: "A" })}
                  className={`px-4 py-2 rounded-md text-sm cursor-pointer ${
                    state.variant === "A"
                      ? "border-none bg-[var(--r-acc)] text-white"
                      : "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
                  }`}
                >
                  Compact
                </button>
                <button
                  type="button"
                  onClick={() => dispatch({ type: "setVariant", payload: "B" })}
                  className={`px-4 py-2 rounded-md text-sm cursor-pointer ${
                    state.variant === "B"
                      ? "border-none bg-[var(--r-acc)] text-white"
                      : "border border-[var(--r-bd)] bg-[var(--r-bg)] text-[var(--r-t1)]"
                  }`}
                >
                  Spacious
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-xl font-semibold mb-6 text-[var(--r-t1)]">
          {getSettingTitle()}
        </h2>
        <div className="text-[var(--r-t2)]">Coming soon...</div>
      </div>
    );
  };

  return (
    <div className="flex h-full w-full">
      {/* Settings Sidebar */}
      <div className="w-60 bg-[var(--r-sf)] border-r border-[var(--r-bd)] p-5 px-3 overflow-y-auto flex-shrink-0">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="text-xs font-bold text-[var(--r-t3)] uppercase pl-3 mt-4 mb-2">
              {category.label}
            </div>
            {category.items.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() =>
                  dispatch({ type: "setView", payload: `settings/${item.id}` })
                }
                className={`w-full text-left px-3 py-2 text-sm border-none rounded-md cursor-pointer transition-all duration-200 ${
                  state.view === `settings/${item.id}`
                    ? "bg-[rgba(99,102,241,0.1)] text-[var(--r-acc)]"
                    : "bg-transparent text-[var(--r-t1)]"
                }`}
                onMouseEnter={(e) => {
                  if (state.view !== `settings/${item.id}`) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "var(--r-hov)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (state.view !== `settings/${item.id}`) {
                    (
                      e.currentTarget as HTMLButtonElement
                    ).style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}

        {/* Logout Button */}
        <button
          type="button"
          onClick={onLogout}
          className="w-full px-3 py-3 mt-6 rounded-md border border-red-500 bg-transparent text-red-500 cursor-pointer text-sm font-medium transition-all duration-200"
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "transparent";
          }}
        >
          Logout
        </button>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
