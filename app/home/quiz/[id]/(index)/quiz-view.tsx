"use client";

import { useCreateBlockNote } from "@blocknote/react";
import { QuestionSchema } from "@/schemas/questionSchema";
import { z } from "zod";
import {
  BlockNoteEditorOptions,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";
import { Editor } from "@/components/bloc-note/editor";

export function QuizView(props: QuizViewProps) {
  const editor = useCreateBlockNote({
    initialContent: props.initialContent,
  });

  return <Editor editor={editor} editable={false} />;
}

export type QuizViewProps = {
  initialContent: Partial<
    BlockNoteEditorOptions<
      DefaultBlockSchema,
      DefaultInlineContentSchema,
      DefaultStyleSchema
    >
  >["initialContent"];
  questionId: string;
  questionType: z.infer<typeof QuestionSchema>["type"];
};
