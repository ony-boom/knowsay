"use client";

import React, { useLayoutEffect, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DynamicQuestionView } from "./dynamic-question-view";
import { AnswerView } from "@/components/quiz/take/answer-view";
import { QuizScoreDisplay } from "@/components/quiz/take/quiz-score-display";
import { useTakeQuizState } from "@/hooks/use-take-quiz-state";
import { Button } from "@/components/ui/button";

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

  const isDone =
    currentQuestion === questions.length - 1 &&
    finishedQuestions.size === questions.length;

  useLayoutEffect(() => {
    reset();
    setState({ totalQuestions: questions.length });
  }, [questions.length, setState, reset]);

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
      <QuizScoreDisplay
        score={score}
        totalQuestions={questions.length}
        currentQuestion={currentQuestion + 1}
      />

      {isDone ? (
        <div>All done! 🎉</div>
      ) : (
        <>
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
                  <div className="space-y-4">
                    <p className="text-foreground/70 text-sm">
                      Question {index + 1}
                    </p>
                    <DynamicQuestionView initialContent={question.content} />
                  </div>
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

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
            <Button
              onClick={previousQuestion}
              variant="secondary"
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={questions.length - 1 === currentQuestion}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export type QuizViewContainerProps = React.ComponentProps<"div"> & {
  questions: {
    id: string;
    content: string;
    type: string;
  }[];
};
