import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { inputRules } from "prosemirror-inputrules";
import { keymap } from "prosemirror-keymap";
import { type Node as PmNode, Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { EditorState } from "prosemirror-state";

// Extended schema with list support
const schema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
  marks: basicSchema.spec.marks,
});

// Create editor state from HTML content
const createEditorState = (content: string) => {
  // Parse simple text/markdown into ProseMirror doc
  // For now, just create paragraphs from content
  const lines = content.split("\n");
  const doc = schema.topNodeType.create(undefined, [
    ...lines
      .filter((line) => line.trim())
      .map((line) => schema.node("paragraph", undefined, [schema.text(line)])),
  ]);

  return EditorState.create({
    doc,
    plugins: [
      history(),
      inputRules({ rules: [] }),
      keymap(baseKeymap),
      keymap({
        "Mod-z": undo,
        "Mod-Shift-z": redo,
        "Ctrl-y": redo,
        // Custom shortcuts can be added here
      }),
    ],
  });
};

// Convert ProseMirror doc back to plain text
const docToText = (doc: PmNode): string => {
  const text: string[] = [];
  doc.forEach((node) => {
    if (node.type.name === "paragraph") {
      text.push(node.textContent);
    } else if (
      node.type.name === "bullet_list" ||
      node.type.name === "ordered_list"
    ) {
      node.forEach((item) => {
        text.push(`- ${item.textContent}`);
      });
    }
  });
  return text.join("\n");
};

export const prosemirrorSetup = {
  schema,
  createEditorState,
  docToText,
};
