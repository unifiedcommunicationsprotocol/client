import { setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { EditorView } from "prosemirror-view";
import { useEffect, useRef, useState } from "react";
import { prosemirrorSetup } from "../../lib/prosemirror-setup";
import { useAppContext } from "../AppContext";
import { NOTES } from "../data";

interface ToolbarButton {
  icon: string;
  title: string;
  active?: (editorView: EditorView) => boolean;
  run: (editorView: EditorView) => void;
}

export function NoteEditor() {
  const { state, dispatch } = useAppContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [lastSaved, setLastSaved] = useState<string>("Just now");

  const selectedNote =
    state.selectedNote !== null
      ? NOTES.find((n) => n.id === state.selectedNote) ||
        state.customNotes.find((n) => n.id === state.selectedNote)
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
        <div style={{ fontSize: "16px", fontWeight: "500" }}>
          Select a note to edit
        </div>
      </div>
    );
  }

  const note = state.noteEdits[selectedNote.id] || {
    title: selectedNote.title,
    body: selectedNote.body,
  };

  useEffect(() => {
    if (!editorRef.current) return;

    // Create editor state and view
    const editorState = prosemirrorSetup.createEditorState(note.body);
    const view = new EditorView(editorRef.current, {
      state: editorState,
      dispatchTransaction(tr) {
        const newState = view.state.apply(tr);
        view.updateState(newState);

        // Save to context
        const bodyText = prosemirrorSetup.docToText(newState.doc);
        dispatch({
          type: "setNoteEdits",
          payload: {
            id: selectedNote.id,
            title: note.title,
            body: bodyText,
          },
        });
        setLastSaved("Saving...");
        setTimeout(() => setLastSaved("Just now"), 500);
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [selectedNote.id, note.title]);

  const { schema } = prosemirrorSetup;

  const toolbarButtons: ToolbarButton[] = [
    {
      icon: "B",
      title: "Bold",
      run: (view) => {
        const mark = schema.marks.strong;
        if (mark) toggleMark(mark)(view.state, view.dispatch);
        view.focus();
      },
    },
    {
      icon: "I",
      title: "Italic",
      run: (view) => {
        const mark = schema.marks.em;
        if (mark) toggleMark(mark)(view.state, view.dispatch);
        view.focus();
      },
    },
    {
      icon: "`",
      title: "Code",
      run: (view) => {
        const mark = schema.marks.code;
        if (mark) toggleMark(mark)(view.state, view.dispatch);
        view.focus();
      },
    },
    {
      icon: "H1",
      title: "Heading 1",
      run: (view) => {
        const node = schema.nodes.heading;
        if (node) setBlockType(node, { level: 1 })(view.state, view.dispatch);
        view.focus();
      },
    },
    {
      icon: "H2",
      title: "Heading 2",
      run: (view) => {
        const node = schema.nodes.heading;
        if (node) setBlockType(node, { level: 2 })(view.state, view.dispatch);
        view.focus();
      },
    },
    {
      icon: "❝",
      title: "Blockquote",
      run: (view) => {
        const node = schema.nodes.blockquote;
        if (node) wrapIn(node)(view.state, view.dispatch);
        view.focus();
      },
    },
    {
      icon: "•",
      title: "Bullet List",
      run: (view) => {
        const node = schema.nodes.bullet_list;
        if (node) wrapIn(node)(view.state, view.dispatch);
        view.focus();
      },
    },
  ];

  const handleToolbarButtonClick = (button: ToolbarButton) => {
    if (viewRef.current) {
      button.run(viewRef.current);
    }
  };

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <input
          type="text"
          value={note.title}
          onChange={(e) =>
            dispatch({
              type: "setNoteEdits",
              payload: {
                id: selectedNote.id,
                title: e.target.value,
                body: note.body,
              },
            })
          }
          placeholder="Note title..."
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "var(--r-t1)",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            flex: 1,
            fontFamily: "inherit",
            padding: "0",
          }}
        />
        <div
          style={{
            fontSize: "11px",
            color: "var(--r-t3)",
            marginLeft: "16px",
            whiteSpace: "nowrap",
          }}
        >
          {lastSaved}
        </div>
      </div>

      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 12px",
          borderBottom: "1px solid var(--r-bd)",
          backgroundColor: "var(--r-sf)",
          flexShrink: 0,
          flexWrap: "wrap",
        }}
      >
        {toolbarButtons.map((button, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleToolbarButtonClick(button)}
            style={{
              width: "28px",
              height: "26px",
              padding: "0",
              border: "1px solid var(--r-bd)",
              borderRadius: "5px",
              backgroundColor: "transparent",
              color: "var(--r-t2)",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 150ms",
            }}
            title={button.title}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--r-hov)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            {button.icon}
          </button>
        ))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
          backgroundColor: "var(--r-bg)",
        }}
        className="prosemirror-editor"
      />
    </div>
  );
}
