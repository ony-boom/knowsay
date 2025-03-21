"use client";

import React, { useLayoutEffect, useRef, useEffect } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { QuestionSchema } from "@/schemas/questionSchema";
import { DynamicQuestionView } from "./dynamic-question-view";
import { AnswerView } from "@/components/quiz/take/answer-view";
import { QuizControl } from "@/components/quiz/take/quiz-control";
import { useTakeQuizState } from "@/hooks/use-take-quiz-state";

export function QuizViewContainer(props: QuizViewContainerProps) {
  const { setState } = useTakeQuizState;
  const {
    currentQuestion,
    score,
    reset,
    nextQuestion,
    previousQuestion,
    setQuestionAsFinished,
    incrementScore,
    finishedQuestions,
  } = useTakeQuizState();
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { questions, ...containerProps } = props;

  useLayoutEffect(() => {
    setState({ totalQuestions: questions.length });
  }, [questions.length, setState]);

  useEffect(() => {
    if (questionRefs.current[currentQuestion]) {
      questionRefs.current[currentQuestion]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [currentQuestion]);

  const handleAnswerSubmit = (isCorrect: boolean, id: string) => {
    if (isCorrect && !finishedQuestions.has(id)) incrementScore();
    setQuestionAsFinished(id);
  };

  return (
    <div className="space-y-8">
      <QuizControl
        onReset={reset}
        onNext={nextQuestion}
        onPrevious={previousQuestion}
        score={score}
        totalQuestions={questions.length}
        currentQuestion={currentQuestion + 1}
      />
      <div
        {...containerProps}
        ref={questionsContainerRef}
        className={cn(
          containerProps.className,
          "scrollbar-hide flex snap-x snap-mandatory overflow-x-hidden",
        )}
      >
        {questions.map((question, index) => {
          return (
            <div
              key={question.id}
              ref={(el) => {
                questionRefs.current[index] = el;
              }}
              className="w-full min-w-full flex-shrink-0 snap-center space-y-8 px-2"
            >
              <DynamicQuestionView initialContent={question.content} />
              <AnswerView
                questionId={question.id}
                questionType={question.type}
                readOnly={finishedQuestions.has(question.id)}
                onAnswerSubmit={(isCorrect) =>
                  handleAnswerSubmit(isCorrect, question.id)
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type QuizViewContainerProps = React.ComponentProps<"div"> & {
  questions: Array<z.infer<typeof QuestionSchema>>;
};
