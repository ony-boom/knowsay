"use client";

import { HTMLProps, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn, swrFetcher } from "@/lib/utils";
import { z } from "zod";
import { QuestionSchema } from "@/schemas/questionSchema";
import useSWR from "swr";
import { AnswerSchema } from "@/schemas/answerSchema";
import { QCMQuiz } from "@/components/quiz/qcm-quiz";

export function StartQuiz(props: StartQuizProps) {
  const { questions, ...divProps } = props;

  const [quizState, setQuizState] = useState({
    score: 0,
    currentQuestion: 0,
  });

  return (
    <div {...divProps} className={cn(props.className)}>
      <div className="flex w-full overflow-x-auto snap-x space-x-4">
        {questions.map((question, index) => {
          return <QuestionItem key={question.id} question={question} />;
        })}
      </div>
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
    <div className="w-full shrink-0 snap-start">
      {renderQuestionBasedOnType(props.question, data)}
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
      <QCMQuiz
        question={question.content}
        options={answers.map((a) => a.content)}
        correctAnswer={answers.filter((a) => a.is_correct)[0].content}
      />
    );
  }

  return <>TODO</>;
};

export type StartQuizProps = HTMLProps<HTMLDivElement> & {
  questions: Array<z.infer<typeof QuestionSchema>>;
};
