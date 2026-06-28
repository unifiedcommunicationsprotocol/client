import { useAppContext } from "../AppContext";

export function EmailBridgeSettings() {
  const { state, dispatch } = useAppContext();

  const providers = [
    { id: "gmail", name: "Gmail", icon: "G", color: "#EA4335" },
    { id: "fastmail", name: "Fastmail", icon: "F", color: "#1C6EF2" },
    { id: "imap", name: "Other IMAP / SMTP", icon: "⇆", color: "#666666" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Email bridge
        </h2>
        <p className="text-sm text-[var(--r-t3)]">
          Connect existing email accounts. Bridged messages are clearly marked — not end-to-end encrypted.
        </p>
      </div>

      {/* Connected accounts */}
      {state.settingsBridgeAccounts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-[var(--r-t1)] uppercase tracking-widest">
            Connected
          </h3>
          {state.settingsBridgeAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-md bg-[var(--r-sf)] border border-[var(--r-bd)]"
            >
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
                  style={{
                    background: account.provider === "gmail" ? "#EA4335" : account.provider === "fastmail" ? "#1C6EF2" : "#666666",
                  }}
                >
                  {account.provider === "gmail" ? "G" : account.provider === "fastmail" ? "F" : "⇆"}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--r-t1)]">
                    {account.email}
                  </div>
                  <div className="text-xs text-[var(--r-t3)]">
                    Syncing · Last updated {account.lastSync || "just now"}
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

      {/* Add account section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-[var(--r-t1)] uppercase tracking-widest">
          {state.settingsBridgeAccounts.length > 0 ? "Add another account" : "Add account"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => {
                dispatch({ type: "setBridgeOauthProvider", payload: provider.id });
                dispatch({ type: "setBridgeOauthStep", payload: "info" });
                dispatch({ type: "setBridgeAccountType", payload: "email" });
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
        Bridged messages are wrapped in a bridge attestation signed by the relay server. They are clearly marked as not end-to-end encrypted.
      </div>
    </div>
  );
}
