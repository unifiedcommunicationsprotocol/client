import { useAppContext } from "../AppContext";
import { NOTES } from "../data";

export function NoteEditor() {
  const { state, dispatch } = useAppContext();

  const selectedNote = state.selectedNote !== null
    ? NOTES.find((n) => n.id === state.selectedNote) || state.customNotes.find((n) => n.id === state.selectedNote)
    : null;

  if (!selectedNote) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--r-t3)",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "48px" }}>📝</div>
        <div style={{ fontSize: "16px", fontWeight: "500" }}>Select a note to edit</div>
      </div>
    );
  }

  const note = state.noteEdits[selectedNote.id] || { title: selectedNote.title, body: selectedNote.body };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-bg)",
        }}
      >
        <input
          type="text"
          value={note.title}
          onChange={(e) =>
            dispatch({
              type: "setNoteEdits",
              payload: { id: selectedNote.id, title: e.target.value, body: note.body },
            })
          }
          placeholder="Note title..."
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "var(--r-t1)",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            fontFamily: "inherit",
            padding: "0",
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <textarea
          value={note.body}
          onChange={(e) =>
            dispatch({
              type: "setNoteEdits",
              payload: { id: selectedNote.id, title: note.title, body: e.target.value },
            })
          }
          placeholder="Start typing your note..."
          style={{
            width: "100%",
            height: "100%",
            padding: "0",
            border: "none",
            backgroundColor: "transparent",
            color: "var(--r-t1)",
            fontSize: "14px",
            fontFamily: "inherit",
            lineHeight: "1.6",
            outline: "none",
            resize: "none",
          }}
        />
      </div>
    </div>
  );
}
