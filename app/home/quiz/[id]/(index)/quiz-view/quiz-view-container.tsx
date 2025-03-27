"use client";

import React, { useLayoutEffect, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { DynamicQuestionView } from "./dynamic-question-view";
import { QuizScoreDisplay } from "@/components/quiz/take/quiz-score-display";
import { useTakeQuizState } from "@/hooks/use-take-quiz-state";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/schemas/quizQuestionSchema";
import { QCM } from "@/schemas/qcmSchema";
import { QuizAttempt } from "@/schemas/quizAttemptSchema";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Redo,
  Clock,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { updateQuizAttempt } from "@/lib/actions/update-quiz-attempt";
import { QcmAnswer } from "@/components/quiz/take/qcm-answer";
import { useTimer } from "@/hooks/use-timer";

const TimeProgress = ({
  timeLeft,
  totalTime,
}: {
  timeLeft: number;
  totalTime: number;
}) => {
  const percentageLeft = (timeLeft / totalTime) * 100;
  const isWarning = percentageLeft <= 50 && percentageLeft > 20;
  const isDanger = percentageLeft <= 20;

  return (
    <div className="bg-card absolute right-0 w-max rounded-lg border">
      <div className="flex items-center gap-2 p-1">
        <div className="flex items-center space-x-2">
          <Clock
            className={cn(
              "h-4 w-4",
              isDanger
                ? "text-destructive animate-pulse"
                : isWarning
                  ? "text-amber-500"
                  : "text-primary",
            )}
          />
        </div>
        <span
          className={cn(
            "text-sm font-semibold",
            isDanger
              ? "text-destructive"
              : isWarning
                ? "text-amber-500"
                : "text-foreground",
          )}
        >
          {Math.ceil(timeLeft)}s
        </span>
      </div>
    </div>
  );
};

const QuestionPagination = ({
  currentQuestion,
  totalQuestions,
  finishedQuestions,
  questions,
}: {
  currentQuestion: number;
  totalQuestions: number;
  finishedQuestions: Set<string>;
  questions: (QuizQuestion & { qcm: QCM })[];
}) => (
  <div className="my-4 flex justify-center space-x-1">
    {Array.from({ length: totalQuestions }).map((_, index) => (
      <motion.div
        key={`pagination-${index}`}
        className={cn(
          "h-2 rounded-full transition-all",
          index === currentQuestion
            ? "bg-primary w-8"
            : finishedQuestions.has(questions[index]?.qcm_id)
              ? "bg-primary/50 w-2"
              : "bg-muted w-2",
        )}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      />
    ))}
  </div>
);

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
    className="mt-8 space-y-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    <h3 className="text-foreground text-2xl font-bold">
      Your Previous Attempts
    </h3>

    <div className="bg-card rounded-xl border shadow-md">
      <div className="space-y-0">
        {previousAttempts.map((attempt, index) => {
          const scorePercentage = (attempt.score / totalQuestions) * 100;
          const scoreColor =
            scorePercentage >= 80
              ? "text-emerald-500"
              : scorePercentage >= 60
                ? "text-amber-500"
                : "text-destructive";

          return (
            <motion.div
              key={attempt.id}
              className="hover:bg-muted/50 flex items-center justify-between border-b p-5 transition-colors last:border-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    scorePercentage >= 80
                      ? "bg-emerald-100"
                      : scorePercentage >= 60
                        ? "bg-amber-100"
                        : "bg-red-100",
                  )}
                >
                  <Trophy
                    className={cn(
                      "h-5 w-5",
                      scorePercentage >= 80
                        ? "text-emerald-500"
                        : scorePercentage >= 60
                          ? "text-amber-500"
                          : "text-destructive",
                    )}
                  />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">
                    Attempt #{index + 1}
                  </p>
                  <div className="flex items-center">
                    <p className={cn("text-xl font-semibold", scoreColor)}>
                      {attempt.score}/{totalQuestions}
                    </p>
                    <span className="text-muted-foreground ml-2 text-sm">
                      ({Math.round(scorePercentage)}%)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm">
                  {new Date(attempt.completed_at!).toLocaleDateString()}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(attempt.completed_at!).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>

    <div className="mt-6 flex justify-center">
      <Button onClick={onRetakeQuiz} className="px-8">
        <Redo />
        Retake Quiz
      </Button>
    </div>
  </motion.div>
);

const QuizCompletion = ({
  score,
  totalQuestions,
  onRetake,
  onViewPreviousAttempts,
  hasPreviousAttempts,
}: {
  score: number;
  totalQuestions: number;
  onRetake: () => void;
  onViewPreviousAttempts: () => void;
  hasPreviousAttempts: boolean;
}) => {
  const percentage = (score / totalQuestions) * 100;
  const isHighScore = percentage >= 80;
  const isMediumScore = percentage >= 60 && percentage < 80;

  return (
    <motion.div
      className="grid h-full w-full place-items-center py-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full space-y-8 text-center">
        <motion.div
          className={cn(
            "mx-auto flex h-32 w-32 items-center justify-center rounded-full p-6",
            isHighScore
              ? "bg-emerald-100"
              : isMediumScore
                ? "bg-amber-100"
                : "bg-red-100",
          )}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        >
          <Trophy
            className={cn(
              "h-16 w-16",
              isHighScore
                ? "text-emerald-500"
                : isMediumScore
                  ? "text-amber-500"
                  : "text-destructive",
            )}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <h3 className="mb-2 text-2xl font-bold">
            {isHighScore
              ? "Excellent work! 🎉"
              : isMediumScore
                ? "Good job! 👍"
                : "Quiz completed! 📝"}
          </h3>
          <div className="mb-6 flex items-center justify-center">
            <span
              className={cn(
                "text-4xl font-bold",
                isHighScore
                  ? "text-emerald-500"
                  : isMediumScore
                    ? "text-amber-500"
                    : "text-destructive",
              )}
            >
              {score}
            </span>
            <span className="text-muted-foreground mx-2 text-2xl">/</span>
            <span className="text-2xl font-medium">{totalQuestions}</span>
            <span className="text-muted-foreground ml-2">
              ({Math.round(percentage)}%)
            </span>
          </div>
          <p className="text-muted-foreground mx-auto mb-8 max-w-xs text-sm">
            {isHighScore
              ? "Outstanding! You've mastered this material."
              : isMediumScore
                ? "Good progress! A bit more practice and you'll master it."
                : "Keep practicing! You'll improve with each attempt."}
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col justify-center gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Button
            onClick={onRetake}
            variant="outline"
            size="lg"
            className="px-6"
          >
            <Redo className="mr-2 h-5 w-5" />
            Retake Quiz
          </Button>
          {hasPreviousAttempts && (
            <Button onClick={onViewPreviousAttempts} size="lg" className="px-6">
              View Previous Attempts
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

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

  const {
    start: startTimer,
    timeLeft,
    isRunning,
    reset: resetTimer,
    isDone: isTimerDone,
  } = useTimer(questions[currentQuestion]?.time_limit || 0);

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

    resetTimer(questions[currentQuestion]?.time_limit || 0);
  }, [currentQuestion, questions, resetTimer]);

  const handleCheckAnswer = useCallback(() => {
    const answer = selectedAnswers[currentQuestionId];
    if (!answer) return;
    if (answer.isCorrect) {
      incrementScore();
    }
    setQuestionAsFinished(currentQuestionId);
  }, [
    currentQuestionId,
    incrementScore,
    selectedAnswers,
    setQuestionAsFinished,
  ]);

  useEffect(() => {
    if (isTimerDone) {
      handleCheckAnswer();
    }
  }, [handleCheckAnswer, isTimerDone]);

  const handleAnswerChange = () => {
    if (!isRunning) {
      startTimer();
    }
  };

  const handleRetakeQuiz = () => {
    setShowPreviousAttempts(false);
    reset();
  };

  useEffect(() => {
    if (currentQuestion !== 0 && !isRunning) {
      startTimer();
    }
  }, [currentQuestion, isRunning, startTimer]);

  return (
    <div className="relative space-y-6">
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
            className="space-y-6"
          >
            <QuizScoreDisplay
              score={score}
              totalQuestions={questions.length}
              currentQuestion={currentQuestion + 1}
            />

            {!isDone && (
              <TimeProgress
                timeLeft={timeLeft}
                totalTime={questions[currentQuestion]?.time_limit || 0}
              />
            )}

            {isDone ? (
              <QuizCompletion
                score={score}
                totalQuestions={questions.length}
                onRetake={handleRetakeQuiz}
                onViewPreviousAttempts={() => setShowPreviousAttempts(true)}
                hasPreviousAttempts={hasPreviousAttempts}
              />
            ) : (
              <>
                <motion.div
                  {...containerProps}
                  ref={questionsContainerRef}
                  className={cn(
                    containerProps.className,
                    "scrollbar-hide flex snap-x snap-mandatory overflow-x-hidden",
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      ref={(el) => {
                        questionRefs.current[index] = el;
                      }}
                      className="w-full min-w-full flex-shrink-0 snap-center"
                      initial={{
                        opacity: 0,
                        x: currentQuestion > index ? -20 : 20,
                      }}
                      animate={{
                        opacity: currentQuestion === index ? 1 : 0,
                        x:
                          currentQuestion === index
                            ? 0
                            : currentQuestion > index
                              ? -20
                              : 20,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <motion.p
                            className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            Question {index + 1} of {questions.length}
                          </motion.p>
                        </div>
                        <DynamicQuestionView
                          initialContent={question.qcm.question}
                        />
                      </div>
                      <QcmAnswer
                        questionId={question.qcm_id}
                        onAnswerChange={handleAnswerChange}
                        readOnly={finishedQuestions.has(question.qcm_id)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <QuestionPagination
                  currentQuestion={currentQuestion}
                  totalQuestions={questions.length}
                  finishedQuestions={finishedQuestions}
                  questions={questions}
                />

                <motion.div
                  className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Button
                    onClick={previousQuestion}
                    variant="outline"
                    size="lg"
                    className="px-6"
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>

                  {currentQuestionAnswered ? (
                    <Button
                      onClick={nextQuestion}
                      size="lg"
                      className="px-6"
                      disabled={questions.length - 1 === currentQuestion}
                    >
                      Next <ChevronRight />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCheckAnswer}
                      size="lg"
                      className={cn(
                        "px-6",
                        currentQuestionSelected ? "animate-pulse" : "",
                      )}
                      disabled={!currentQuestionSelected}
                    >
                      <Check /> Submit Answer
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
