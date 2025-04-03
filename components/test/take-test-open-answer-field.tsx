"use client";

import { Editor } from "@/components/bloc-note/editor";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";
import { Block } from "@blocknote/core";

export function TakeTestOpenAnswerField({
  onChange,
  value,
}: TakeTestOpenAnswerFieldProps) {
  const [blocks, setBlocks] = useState<Block[]>(value || []);
  const editor = useCreateBlockNote({
    initialContent: blocks.length > 0 ? blocks : undefined,
  });

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

export type TakeTestOpenAnswerFieldProps = {
  onChange?: (block: Block[]) => void;
  value?: Block[];
};
