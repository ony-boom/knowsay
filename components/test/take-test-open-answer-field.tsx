"use client";

import { Editor } from "@/components/bloc-note/editor";
import { useCreateBlockNote } from "@blocknote/react";
import { useState } from "react";
import { Block } from "@blocknote/core";

export function TakeTestOpenAnswerField({
  onChange,
  value,
  readOnly,
}: TakeTestOpenAnswerFieldProps) {
  const [, setBlocks] = useState<Block[]>([]);
  const editor = useCreateBlockNote({
    initialContent: value?.length ? value : undefined,
  });

  return (
    <Editor
      editor={editor}
      editable={!readOnly}
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
  readOnly?: boolean;
};
