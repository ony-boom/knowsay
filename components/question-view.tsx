"use client";

import { useCreateBlockNote } from "@blocknote/react";
import {
  BlockNoteEditorOptions,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";
import { Editor } from "@/components/bloc-note/editor";
import { useMemo } from "react";

export default function QuestionView(props: QuizViewProps) {
  const content = useMemo(() => {
    try {
      return JSON.parse(props.initialContent);
    } catch {
      return [
        {
          type: "paragraph",
          children: [{ text: "Something went wrong parsing the question" }],
        },
      ];
    }
  }, [props.initialContent]) satisfies InitialContent;

  const editor = useCreateBlockNote({
    initialContent: content,
  });

  return <Editor editor={editor} editable={false} />;
}

type InitialContent = Partial<
  BlockNoteEditorOptions<
    DefaultBlockSchema,
    DefaultInlineContentSchema,
    DefaultStyleSchema
  >
>["initialContent"];

export type QuizViewProps = {
  initialContent: string;
};
