import { useAppContext } from "../AppContext";

export function KeysSettings() {
  const { dispatch } = useAppContext();

  const keysets = [
    {
      id: "ks-primary",
      name: "Primary Key",
      created: "2026-01-15",
      rotation: "2026-04-15",
      status: "active",
      fingerprint: "6366F1A2B3C4D5E6F7G8H9I0J1K2L3M4",
    },
    {
      id: "ks-secondary",
      name: "Secondary Key",
      created: "2025-10-20",
      rotation: "2026-01-20",
      status: "retired",
      fingerprint: "0EA5E9F2G3H4I5J6K7L8M9N0O1P2Q3R4",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[var(--r-t1)] m-0">
          Keys
        </h1>
        <button
          type="button"
          onClick={() => dispatch({ type: "setKeygenStep", payload: 1 })}
          className="px-4 py-2 text-xs font-semibold rounded-md bg-[var(--r-acc)] text-white cursor-pointer hover:opacity-90"
        >
          + New keyset
        </button>
      </div>

      {/* Keysets */}
      <div className="flex flex-col gap-3 mb-8">
        {keysets.map((keyset) => (
          <div
            key={keyset.id}
            className={`bg-[var(--r-sf)] p-5 rounded-lg ${
              keyset.status === "active"
                ? "border border-indigo-500"
                : "border border-[var(--r-bd)]"
            }`}
          >
            {/* Header with status */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  keyset.status === "active"
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <h3 className="text-sm font-semibold text-[var(--r-t1)] m-0 flex-1">
                {keyset.name}
              </h3>
              <span
                className={`text-xs font-medium capitalize ${
                  keyset.status === "active"
                    ? "text-green-500"
                    : "text-gray-400"
                }`}
              >
                {keyset.status}
              </span>
            </div>

            {/* Fingerprint */}
            <div className="bg-[var(--r-bg)] px-3 py-2 rounded text-xs font-mono text-[var(--r-t3)] mb-3 break-all">
              {keyset.fingerprint}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-[var(--r-t3)] mb-1">
                  Created
                </div>
                <div className="text-sm text-[var(--r-t1)]">
                  {keyset.created}
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--r-t3)] mb-1">
                  Rotation date
                </div>
                <div className="text-sm text-[var(--r-t1)]">
                  {keyset.rotation}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              {keyset.status !== "active" && (
                <button
                  type="button"
                  className="flex-1 px-3 py-1.5 text-xs font-medium rounded border border-[var(--r-acc)] bg-transparent text-[var(--r-acc)] cursor-pointer hover:bg-[var(--r-accd)]"
                >
                  Use this
                </button>
              )}
              <button
                type="button"
                className="flex-1 px-3 py-1.5 text-xs font-medium rounded border border-[var(--r-bd)] bg-transparent text-[var(--r-t1)] cursor-pointer hover:bg-[var(--r-hov)]"
              >
                Rotate
              </button>
              <button
                type="button"
                className="flex-1 px-3 py-1.5 text-xs font-medium rounded border border-[var(--r-bd)] bg-transparent text-red-500 cursor-pointer hover:bg-red-500/5"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/10 p-5 rounded-lg border border-red-500">
        <div className="text-xs font-semibold text-red-500 mb-2">
          Danger Zone
        </div>
        <button
          type="button"
          className="px-4 py-2 text-xs font-semibold border border-red-500 rounded-md bg-transparent text-red-500 cursor-pointer hover:bg-red-500/10"
        >
          Revoke identity...
        </button>
      </div>
    </div>
  );
}
