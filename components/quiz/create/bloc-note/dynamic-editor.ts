"use client";

import { Block } from "@blocknote/core";
import dynamic from "next/dynamic";

export type QuestionEditorProps = {
  value?: Block[];
  onChange: (value: Block[]) => void;
};

export const DynamicQuestionEditor = dynamic<QuestionEditorProps>(
  () => import("./question-editor"),
  { ssr: false },
);
