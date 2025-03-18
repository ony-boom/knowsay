"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

export function QuizView(props: QuizViewProps) {
  const editor = useCreateBlockNote({
    initialContent: props.initialContent,
  });
  // render
  return <BlockNoteView theme="light" editor={editor} editable={false} />;
}

export type QuizViewProps = {
  initialContent: any;
};
