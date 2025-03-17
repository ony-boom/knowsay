"use client";

import { HTMLProps, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn, swrFetcher } from "@/lib/utils";
import { z } from "zod";
import { QuestionSchema } from "@/schemas/questionSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSWR from "swr";
import { AnswerSchema } from "@/schemas/answerSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function StartQuiz(props: StartQuizProps) {
  const { questions, ...divProps } = props;

  const [quizState, setQuizState] = useState({
    score: 0,
    currentQuestion: 0,
  });

  return (
    <div {...divProps} className={cn(props.className)}>
      <ScrollArea className="mt-8 flex w-full">
        {questions.map((question, index) => {
          return <QuestionItem key={question.id} question={question} />;
        })}
      </ScrollArea>
    </div>
  );
}

const QuestionItem = (props: { question: z.infer<typeof QuestionSchema> }) => {
  const { data, isLoading } = useSWR<z.infer<typeof AnswerSchema>[]>(
    `/api/questions/answers/${props.question.id}`,
    swrFetcher,
  );

  if (!data) return null;

  return (
    <div className="shrink-0 grow space-y-4">
      <h3 className="">{props.question.content}</h3>

      <div>{renderQuestionBasedOnType(props.question, data)}</div>
    </div>
  );
};

const renderQuestionBasedOnType = (
  question: z.infer<typeof QuestionSchema>,
  answers: Array<z.infer<typeof AnswerSchema>>,
) => {
  const { type } = question;

  if (type === "QCM") {
    return (
      <RadioGroup>
        {answers.map((answer, index) => {
          return (
            <div
              className="border-border flex w-full items-center space-x-4 rounded-md border p-4"
              key={answer.id}
            >
              <RadioGroupItem value={answer.content} id={`r${index + 1}`} />
              <Label htmlFor={`r${index + 1}`}>{answer.content}</Label>
            </div>
          );
        })}
      </RadioGroup>
    );
  }

  return <>TODO</>;
};

export type StartQuizProps = HTMLProps<HTMLDivElement> & {
  questions: Array<z.infer<typeof QuestionSchema>>;
};
