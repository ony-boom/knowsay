"use client";

import React from "react";
import { z } from "zod";
import { QcmAnswer } from "./qcm-answer";
import { OpenAnswer } from "./open-answer";
import { QuestionSchema } from "@/schemas/questionSchema";

export function AnswerView(props: AnswerViewProps) {
  const { questionType } = props;

  if (questionType === "OPEN") {
    return <OpenAnswer />;
  }

  return (
    <QcmAnswer
      readOnly={props.readOnly}
      onAnswerSubmitted={props.onAnswerSubmit}
      questionId={props.questionId}
    />
  );
}

type QuestionType = z.infer<typeof QuestionSchema>["type"];

export type AnswerViewProps = React.ComponentProps<"div"> & {
  questionType: QuestionType;
  questionId: string;
  readOnly?: boolean;
  onAnswerSubmit: (isCorrect: boolean) => void;
};
