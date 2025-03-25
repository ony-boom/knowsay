"use client";

import React from "react";
import { QcmAnswer } from "./qcm-answer";

export function AnswerView(props: AnswerViewProps) {
  return (
    <QcmAnswer
      readOnly={props.readOnly}
      onAnswerSubmitted={props.onAnswerSubmit}
      questionId={props.questionId}
    />
  );
}

export type AnswerViewProps = React.ComponentProps<"div"> & {
  questionId: string;
  readOnly?: boolean;
  onAnswerSubmit: (isCorrect: boolean) => void;
};
