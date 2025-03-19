"use client";

import { Block } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";

export const BlocNote = () => {
  const [, setBlocks] = useState<Block[]>([]);

  const editor = useCreateBlockNote();

  return (
    <BlockNoteView
      editor={editor}
      theme="light"
      onChange={() => {
        // Saves the document JSON to state.
        setBlocks(editor.document);
      }}
    />
  );
};
