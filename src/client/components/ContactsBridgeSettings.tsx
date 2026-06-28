import { useAppContext } from "../AppContext";
import { Icon } from "./Icon";

export function ContactsBridgeSettings() {
  const { state, dispatch } = useAppContext();

  const providers = [
    { id: "google", name: "Google Contacts", icon: "google", color: "#EA4335" },
    { id: "fastmail", name: "Fastmail Contacts", icon: "fastmail", color: "#1C6EF2" },
    { id: "carddav", name: "Any CardDAV source", icon: "carddav", color: "#666666" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Contacts (CardDAV)
        </h2>
        <p className="text-sm text-[var(--r-t3)]">
          Sync contacts from external address books via CardDAV. Contacts appear in your Relay directory and autocomplete.
        </p>
      </div>

      {/* Connected contacts */}
      {state.settingsCardAccounts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-[var(--r-t1)] uppercase tracking-widest">
            Connected
          </h3>
          {state.settingsCardAccounts.map((account) => (
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
                  <Icon
                    name={account.provider === "google" ? "google" : account.provider === "fastmail" ? "fastmail" : "carddav"}
                    size={16}
                  />
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

      {/* Add contacts section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-[var(--r-t1)] uppercase tracking-widest">
          {state.settingsCardAccounts.length > 0 ? "Connect another" : "Connect an address book"}
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
                dispatch({ type: "setBridgeAccountType", payload: "carddav" });
              }}
              className="flex flex-col items-center justify-center gap-3 p-5 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)] cursor-pointer hover:border-[var(--r-acc)] hover:bg-[var(--r-accd)] transition-all"
            >
              <div
                className="w-10 h-10 rounded flex items-center justify-center text-white"
                style={{ background: provider.color }}
              >
                <Icon name={provider.icon} size={20} />
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
        Synced contacts are read-only by default. CardDAV write sync can be enabled per address book. Contacts from external sources are marked with their origin.
      </div>
    </div>
  );
}
