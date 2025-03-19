"use client";

import { useState } from "react";
import { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { Editor } from "@/components/bloc-note/editor";

export default function QuestionEditor() {
  const [, setBlocks] = useState<Block[]>([]);

  const editor = useCreateBlockNote();

  return (
    <Editor
      editor={editor}
      onChange={() => {
        // Saves the document JSON to state.
        setBlocks(editor.document);
      }}
    />
  );
}
