"use client";

import React, { useLayoutEffect, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DynamicQuestionView } from "./dynamic-question-view";
import { AnswerView } from "@/components/quiz/take/answer-view";
import { QuizScoreDisplay } from "@/components/quiz/take/quiz-score-display";
import { useTakeQuizState } from "@/hooks/use-take-quiz-state";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/schemas/quizQuestionSchema";
import { QCM } from "@/schemas/qcmSchema";
import { QuizAttempt } from "@/schemas/quizAttemptSchema";
import { ChevronLeft, ChevronRight, Check, Redo } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { updateQuizAttempt } from "@/lib/actions/update-quiz-attempt";

const PreviousAttempts = ({
  previousAttempts,
  onRetakeQuiz,
  totalQuestions,
}: {
  previousAttempts: QuizAttempt[];
  onRetakeQuiz: () => void;
  totalQuestions: number;
}) => (
  <motion.div
    className="mt-8 space-y-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-xl font-semibold">Your Previous Attempts</h3>

    <div className="bg-card rounded-lg border shadow-sm">
      <div className="space-y-4 p-6">
        {previousAttempts.map((attempt, index) => (
          <div
            key={attempt.id}
            className="border-b pb-3 last:border-0 last:pb-0"
          >
            <p className="text-foreground/70 text-sm">Attempt #{index + 1}</p>
            <p className="text-lg font-semibold">
              Score: {attempt.score}/{totalQuestions}
            </p>
            <p className="text-muted-foreground text-sm">
              {new Date(attempt.completed_at!).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6 flex justify-center">
      <Button onClick={onRetakeQuiz}>
        <Redo className="mr-2 h-4 w-4" />
        Retake Quiz
      </Button>
    </div>
  </motion.div>
);

export function QuizViewContainer(props: QuizViewContainerProps) {
  const {
    currentQuestion,
    score,
    reset,
    nextQuestion,
    previousQuestion,
    setQuestionAsFinished,
    incrementScore,
    finishedQuestions,
    selectedAnswers,
  } = useTakeQuizState();

  const { setState } = useTakeQuizState;

  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { questions, previousAttempts, quizId, ...containerProps } = props;

  const hasPreviousAttempts = Boolean(
    previousAttempts?.length && previousAttempts.length > 0,
  );

  const [showPreviousAttempts, setShowPreviousAttempts] =
    React.useState(hasPreviousAttempts);

  const isDone =
    currentQuestion === questions.length - 1 &&
    finishedQuestions.size === questions.length;

  const currentQuestionId = questions[currentQuestion]?.qcm_id;
  const currentQuestionAnswered = finishedQuestions.has(currentQuestionId);
  const currentQuestionSelected = Boolean(selectedAnswers[currentQuestionId]);

  const submitQuizAttempt = useCallback(async () => {
    await updateQuizAttempt({
      quizId,
      score,
    });
  }, [quizId, score]);

  useEffect(() => {
    if (isDone) {
      submitQuizAttempt().then(() => {});
    }
  }, [isDone, submitQuizAttempt]);

  useLayoutEffect(() => {
    reset();
    setState({ totalQuestions: questions.length });
  }, [questions.length, reset, setState]);

  useEffect(() => {
    if (questionRefs.current[currentQuestion]) {
      questionRefs.current[currentQuestion]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [currentQuestion]);

  const handleCheckAnswer = () => {
    const answer = selectedAnswers[currentQuestionId];
    if (!answer) return;
    if (answer.isCorrect) {
      incrementScore();
    }
    setQuestionAsFinished(currentQuestionId);
  };

  const handleRetakeQuiz = () => {
    setShowPreviousAttempts(false);
    reset();
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {showPreviousAttempts ? (
          <PreviousAttempts
            key="previous-attempts"
            totalQuestions={questions.length}
            previousAttempts={previousAttempts || []}
            onRetakeQuiz={handleRetakeQuiz}
          />
        ) : (
          <motion.div
            key="quiz-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <QuizScoreDisplay
              score={score}
              totalQuestions={questions.length}
              currentQuestion={currentQuestion + 1}
            />

            {isDone ? (
              <motion.div
                className="grid h-full w-full place-items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-4 text-center">
                  <h3 className="text-xl font-bold">All done! 🎉</h3>
                  <p className="text-muted-foreground">
                    You scored {score} out of {questions.length}
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleRetakeQuiz} variant="outline">
                      Retake Quiz
                    </Button>
                    {hasPreviousAttempts && (
                      <Button onClick={() => setShowPreviousAttempts(true)}>
                        View Previous Attempts
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  {...containerProps}
                  ref={questionsContainerRef}
                  className={cn(
                    containerProps.className,
                    "scrollbar-hide flex snap-x snap-mandatory overflow-x-hidden",
                  )}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      ref={(el) => {
                        questionRefs.current[index] = el;
                      }}
                      className="w-full min-w-full flex-shrink-0 snap-center space-y-8 px-2"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: currentQuestion === index ? 1 : 0.5,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-4">
                        <p className="text-muted-foreground text-sm">
                          Question {index + 1} of {questions.length}
                        </p>
                        <DynamicQuestionView
                          initialContent={question.qcm.question}
                        />
                      </div>
                      <AnswerView
                        questionId={question.qcm_id}
                        readOnly={finishedQuestions.has(question.qcm_id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="flex flex-col gap-4 sm:flex-row sm:justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={previousQuestion}
                    variant="secondary"
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </Button>

                  {currentQuestionAnswered ? (
                    <Button
                      onClick={nextQuestion}
                      disabled={questions.length - 1 === currentQuestion}
                    >
                      Next <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCheckAnswer}
                      disabled={!currentQuestionSelected}
                    >
                      <Check /> Check Answer
                    </Button>
                  )}
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type QuizViewContainerProps = React.ComponentProps<typeof motion.div> & {
  quizId: string;
  questions: (QuizQuestion & {
    qcm: QCM;
  })[];
  previousAttempts: QuizAttempt[] | null;
};
