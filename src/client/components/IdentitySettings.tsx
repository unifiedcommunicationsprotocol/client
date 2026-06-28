export function IdentitySettings() {
  const ucpAddress = "alice@relay.im";
  const displayName = "Alice Johnson";

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--r-t1)] mb-6">
        Identity
      </h1>

      {/* UCP Address */}
      <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)] mb-6">
        <div className="text-xs font-semibold text-[var(--r-t2)] uppercase mb-3">
          UCP Address
        </div>
        <div className="bg-[var(--r-bg)] p-3 rounded-md border border-[var(--r-bd)] text-sm font-mono text-[var(--r-t1)]">
          {ucpAddress}
        </div>
      </div>

      {/* Display Name */}
      <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)] mb-6">
        <label className="text-xs font-semibold text-[var(--r-t2)] uppercase block mb-3">
          Display Name
        </label>
        <input
          type="text"
          defaultValue={displayName}
          className="w-full px-3 py-2.5 text-sm border border-[var(--r-bd)] rounded-md bg-[var(--r-bg)] text-[var(--r-t1)]"
        />
      </div>

      {/* Active Keyset */}
      <div className="bg-[var(--r-sf)] p-5 rounded-lg border border-[var(--r-bd)]">
        <div className="text-xs font-semibold text-[var(--r-t2)] uppercase mb-3">
          Active Keyset
        </div>
        <div className="bg-[var(--r-bg)] p-3 rounded-md border border-indigo-500 text-sm text-[var(--r-t1)]">
          <div className="font-semibold mb-2">
            Primary Key
          </div>
          <div className="text-xs text-[var(--r-t3)] mb-2">
            Created: 2026-01-15
          </div>
          <button
            type="button"
            className="px-3 py-1.5 text-xs rounded bg-[var(--r-acc)] text-white cursor-pointer hover:opacity-90 transition-opacity"
          >
            Manage keys →
          </button>
        </div>
      </div>
    </div>
  );
}
