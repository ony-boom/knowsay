"use client";

import { useState } from "react";
import { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { Editor } from "@/components/bloc-note/editor";
import { QuestionEditorProps } from "./dynamic-editor";

export default function QuestionEditor({ onChange }: QuestionEditorProps) {
  const [, setBlocks] = useState<Block[]>([]);

  const editor = useCreateBlockNote();

  return (
    <Editor
      editor={editor}
      onChange={() => {
        // Saves the document JSON to state.
        const blocks = editor.document;
        setBlocks(blocks);
        if (onChange) {
          onChange(blocks);
        }
      }}
    />
  );
}
