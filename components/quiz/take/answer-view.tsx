"use client";

import { z } from "zod";
import { QcmAnswer } from "./qcm-answer";
import { OrderAnswer } from "./order-answer";
import { MatchAnswer } from "./match-answer";
import { QuestionSchema } from "@/schemas/questionSchema";
import React from "react";

export function AnswerView(props: AnswerViewProps) {
  const { questionType } = props;

  if (questionType === "MATCHING") {
    return <MatchAnswer />;
  }

  if (questionType === "ORDER") {
    return <OrderAnswer />;
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
