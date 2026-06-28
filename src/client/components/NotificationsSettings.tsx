import { useAppContext } from "../AppContext";

export function NotificationsSettings() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--r-t1)] mb-1">
          Notifications
        </h2>
        <p className="text-sm text-[var(--r-t3)]">Manage how and when you receive alerts</p>
      </div>

      {/* Push notifications */}
      <div className="flex justify-between items-center pb-4 border-b border-[var(--r-bd)]">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-0.5">
            Push notifications
          </div>
          <p className="text-xs text-[var(--r-t3)]">Receive alerts for new messages</p>
        </div>
        <input
          type="checkbox"
          checked={state.notifBadge}
          onChange={(e) => dispatch({ type: "setNotifBadge", payload: e.target.checked })}
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)]"
        />
      </div>

      {/* Sound alerts */}
      <div className="flex justify-between items-center pb-4 border-b border-[var(--r-bd)]">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-0.5">
            Sound alerts
          </div>
          <p className="text-xs text-[var(--r-t3)]">Play a sound for new messages</p>
        </div>
        <input
          type="checkbox"
          checked={state.notifSound}
          onChange={(e) => dispatch({ type: "setNotifSound", payload: e.target.checked })}
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)]"
        />
      </div>

      {/* Badge count */}
      <div className="flex justify-between items-center">
        <div>
          <div className="text-sm font-medium text-[var(--r-t1)] mb-0.5">
            Badge count
          </div>
          <p className="text-xs text-[var(--r-t3)]">Show unread count on app icon</p>
        </div>
        <input
          type="checkbox"
          defaultChecked
          className="w-9 h-5 cursor-pointer accent-[var(--r-acc)]"
        />
      </div>
    </div>
  );
}
