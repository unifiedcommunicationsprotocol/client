import { useAppContext } from "../AppContext";

export function CalendarBridgeSettings() {
  const { state, dispatch } = useAppContext();

  const providers = [
    { id: "google", name: "Google Calendar", icon: "G", color: "#EA4335" },
    { id: "fastmail", name: "Fastmail Calendar", icon: "F", color: "#1C6EF2" },
    { id: "caldav", name: "Any CalDAV source", icon: "⇆", color: "#666666" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Calendar bridge
        </h2>
        <p className="text-sm text-[var(--r-t3)]">
          Sync external calendars into your UCP calendar. Events are read/write and clearly marked by source.
        </p>
      </div>

      {/* Connected calendars */}
      {state.settingsCalAccounts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-[var(--r-t1)] uppercase tracking-widest">
            Connected
          </h3>
          {state.settingsCalAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{
                    background: account.provider === "google" ? "#EA4335" : account.provider === "fastmail" ? "#1C6EF2" : "#666666",
                  }}
                >
                  {account.provider === "google" ? "G" : account.provider === "fastmail" ? "F" : "⇆"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--r-t1)]">
                    {account.name}
                  </div>
                  <div className="text-xs text-[var(--r-t3)]">
                    Syncing · {account.email} · {account.lastSync}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded text-xs font-medium text-red-500 hover:bg-red-500/10 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add calendar section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-[var(--r-t1)] uppercase tracking-widest">
          {state.settingsCalAccounts.length > 0 ? "Connect another" : "Connect a calendar"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => {
                dispatch({
                  type: "setBridgeOauthProvider",
                  payload: provider.id,
                });
                dispatch({ type: "setBridgeOauthStep", payload: "info" });
                dispatch({ type: "setBridgeAccountType", payload: "calendar" });
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)] cursor-pointer hover:border-[var(--r-acc)] hover:bg-[var(--r-accd)] transition-all"
            >
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-white text-lg font-semibold"
                style={{ background: provider.color }}
              >
                {provider.icon}
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-[var(--r-t1)]">
                  {provider.name}
                </div>
                <div className="text-xs text-[var(--r-acc)]">
                  Connect →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="p-3 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)] text-xs text-[var(--r-t2)] leading-relaxed">
        Synced events are read/write. CalDAV sources require a server URL and credentials. Events from bridged sources are labelled with their origin.
      </div>
    </div>
  );
}
