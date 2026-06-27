export function NotesPanel() {
  const notes = [
    {
      id: "1",
      title: "Q3 Planning Notes",
      preview: "Goals for the quarter, team priorities...",
      updated: "Today",
      pinned: true,
    },
    {
      id: "2",
      title: "Meeting Notes - 2026-06-27",
      preview: "Discussed timeline for feature rollout...",
      updated: "Today",
      pinned: false,
    },
    {
      id: "3",
      title: "Product Roadmap",
      preview: "v1.0 launch plan, features for v1.1...",
      updated: "2 days ago",
      pinned: true,
    },
    {
      id: "4",
      title: "Design System Components",
      preview: "Button variants, color palette...",
      updated: "1 week ago",
      pinned: false,
    },
    {
      id: "5",
      title: "API Documentation",
      preview: "Endpoint specs, authentication flow...",
      updated: "2 weeks ago",
      pinned: false,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "11px 12px 9px", borderBottom: "1px solid var(--r-bd)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}>
          Notes
        </span>
        <button
          type="button"
          style={{
            width: "28px",
            height: "28px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "var(--r-acc)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "16px",
          }}
          title="Add new note"
        >
          +
        </button>
      </div>

      {/* Notes List */}
      <div style={{ flex: 1, overflow: "auto", padding: "6px 8px" }}>
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 12px",
              marginBottom: "4px",
              border: "none",
              backgroundColor: "var(--r-sf2)",
              color: "var(--r-t1)",
              cursor: "pointer",
              borderRadius: "6px",
              transition: "background-color 200ms",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-hov)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--r-sf2)";
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
              {note.pinned && (
                <span style={{ fontSize: "12px", marginTop: "1px" }}>📌</span>
              )}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "var(--r-t1)",
                    marginBottom: "2px",
                  }}
                >
                  {note.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--r-t3)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {note.preview}
                </div>
              </div>
            </div>
            <div style={{ fontSize: "10px", color: "var(--r-t3)", paddingLeft: "20px" }}>
              {note.updated}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
