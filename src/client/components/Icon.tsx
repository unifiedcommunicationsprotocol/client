interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className = "" }: IconProps) {
  const baseClass = `inline-block flex-shrink-0 ${className}`;
  const style = { width: `${size}px`, height: `${size}px` };

  const icons: Record<string, React.ReactNode> = {
    // Navigation & UI
    inbox: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <path d="m16 9-4 3-4-3" />
      </svg>
    ),
    messages: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    contacts: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    notes: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    agents: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 0l4.24-4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08 0l4.24 4.24" />
      </svg>
    ),

    // Compose & Actions
    paperclip: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M10.5 1.5H6a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5" />
        <path d="M14 4l8-3v11" />
      </svg>
    ),
    send: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass} style={style}>
        <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.9429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.01449553 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4762787 C0.994623095,2.05256756 0.837654326,3.1 1.15159189,3.88563296 L3.03521743,10.3266258 C3.03521743,10.4837232 3.19218622,10.6408206 3.50612381,10.6408206 L16.6915026,11.4263075 C16.6915026,11.4263075 17.1624089,11.4263075 17.1624089,11.9975862 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
      </svg>
    ),

    // Messages & Communication
    email: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    lock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    unlock: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 9.2-1" />
      </svg>
    ),

    // Provider Icons
    gmail: (
      <svg viewBox="0 0 24 24" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#EA4335" />
      </svg>
    ),
    fastmail: (
      <svg viewBox="0 0 24 24" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#1C6EF2" />
      </svg>
    ),
    imap: (
      <svg viewBox="0 0 24 24" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#666666" />
      </svg>
    ),
    google: (
      <svg viewBox="0 0 24 24" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#EA4335" />
      </svg>
    ),
    carddav: (
      <svg viewBox="0 0 24 24" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#666666" />
      </svg>
    ),
    caldav: (
      <svg viewBox="0 0 24 24" className={baseClass} style={style}>
        <rect x="2" y="4" width="20" height="16" rx="2" fill="#666666" />
      </svg>
    ),

    // Editor Icons
    bold: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
      </svg>
    ),
    italic: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <line x1="19" y1="4" x2="10" y2="4" />
        <line x1="14" y1="20" x2="5" y2="20" />
        <line x1="15" y1="4" x2="9" y2="20" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    ),
    h1: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M4 12h7M4 4v16M11 4v16M17 13v7M17 4v7" />
      </svg>
    ),
    h2: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <path d="M4 12h4M4 4v16M8 4v16M14 20l5-5a2 2 0 0 0 0-2.828l-3.172-3.172a2 2 0 0 0-2.828 0L14 9" />
      </svg>
    ),
    quote: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass} style={style}>
        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.75-5.63-6-5-1.5 2-2 4-2 6.5 0 1.5.75 2.75 2 3 1.25.25 3.5 0 4.5-1 .5-.5 1-1.5 1-2 1 1 0 2.5-1 3.5-1 2-2.5 3-4 4-.5.5-1 2-1 3 0 1 1.5 3 4 3 2 0 4-1 4-3" />
      </svg>
    ),
    list: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),

    // Status Icons
    check: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={baseClass} style={style}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    close: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    moon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass} style={style}>
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={baseClass} style={style}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    ),

    // Default
    dot: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={baseClass} style={style}>
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  };

  return <span>{icons[name] || icons["dot"]}</span>;
}
