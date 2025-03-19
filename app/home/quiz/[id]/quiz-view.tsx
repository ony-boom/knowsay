"use client";

import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/shadcn/style.css";
import { BlockNoteView } from "@blocknote/shadcn";
import { QuestionSchema } from "@/schemas/questionSchema";
import { z } from "zod";
import {
  BlockNoteEditorOptions,
  DefaultBlockSchema,
  DefaultInlineContentSchema,
  DefaultStyleSchema,
} from "@blocknote/core";

export default function QuizView(props: QuizViewProps) {
  const editor = useCreateBlockNote({
    initialContent: props.initialContent,
  });

  return <BlockNoteView theme="light" editor={editor} editable={false} />;
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
