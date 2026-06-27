import { useAppContext } from "../AppContext";
import { NOTES } from "../data";

export function NotesPanel() {
  const { state, dispatch } = useAppContext();

  const allNotes = [...NOTES, ...state.customNotes];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "11px 12px 9px",
          borderBottom: "1px solid var(--r-bd)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{ fontSize: "14px", fontWeight: "600", color: "var(--r-t1)" }}
        >
          Notes
        </span>
        <button
          type="button"
          onClick={() => {
            const newNote = {
              id: Math.max(...NOTES.map((n) => n.id), ...[0]) + 1,
              title: "New Note",
              body: "",
              pinned: false,
            };
            dispatch({ type: "addCustomNote", payload: newNote });
            dispatch({ type: "selectNote", payload: newNote.id });
          }}
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
        {allNotes.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => dispatch({ type: "selectNote", payload: note.id })}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 12px",
              marginBottom: "4px",
              border: "none",
              backgroundColor:
                state.selectedNote === note.id
                  ? "var(--r-sel)"
                  : "var(--r-sf2)",
              color: "var(--r-t1)",
              cursor: "pointer",
              borderRadius: "6px",
              transition: "background-color 200ms",
            }}
            onMouseEnter={(e) => {
              if (state.selectedNote !== note.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-hov)";
              }
            }}
            onMouseLeave={(e) => {
              if (state.selectedNote !== note.id) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--r-sf2)";
              }
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
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
                  {note.body.substring(0, 50)}...
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
