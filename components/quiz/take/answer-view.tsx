import { z } from "zod";
import { QcmAnswer } from "./qcm-answer";
import { OpenAnswer } from "./open-answer";
import { OrderAnswer } from "./order-answer";
import { MatchAnswer } from "./match-answer";
import { AnswerSchema } from "@/schemas/answerSchema";
import { QuestionSchema } from "@/schemas/questionSchema";

export function AnswerView(props: AnswerViewProps) {
  const { questionType } = props;

  if (questionType === "MATCHING") {
    return <MatchAnswer />;
  }

  if (questionType === "OPEN") {
    return <OpenAnswer />;
  }

  if (questionType === "ORDER") {
    return <OrderAnswer />;
  }

  return <QcmAnswer answers={props.answers} />;
}

type QuestionType = z.infer<typeof QuestionSchema>["type"];

export type AnswerViewProps = React.ComponentProps<"div"> & {
  questionType: QuestionType;
  answers: z.infer<typeof AnswerSchema>[];
};
