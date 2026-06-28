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
      <div className="flex-1 flex items-center justify-center text-[var(--r-t3)] flex-col gap-4">
        <div className="text-6xl">📝</div>
        <div className="text-base font-medium">
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--r-bd)] bg-[var(--r-bg)] flex items-center justify-between">
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
          className="text-2xl font-bold text-[var(--r-t1)] bg-transparent border-none outline-none flex-1 p-0"
        />
        <div className="text-xs text-[var(--r-t3)] ml-4 whitespace-nowrap">
          {lastSaved}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--r-bd)] bg-[var(--r-sf)] flex-shrink-0 flex-wrap">
        {toolbarButtons.map((button, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleToolbarButtonClick(button)}
            className="w-7 h-[26px] p-0 border border-[var(--r-bd)] rounded-sm bg-transparent text-[var(--r-t2)] cursor-pointer text-xs font-semibold flex items-center justify-center transition-colors duration-150"
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
        className="flex-1 overflow-auto p-5 bg-[var(--r-bg)] prosemirror-editor"
      />
    </div>
  );
}
