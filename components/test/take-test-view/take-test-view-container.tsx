"use client";

import { cn } from "@/lib/utils";
import { TestQuestion } from "@/schemas/testQuestionSchema";
import { TakeTestListItem } from "./take-test-list-item";
import { useTimer } from "@/hooks/use-timer";
import { TimeProgress } from "@/components/time-progress";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { useTakeTestStore } from "@/hooks/use-take-test-store";
import { Fragment, useLayoutEffect } from "react";
import { saveTestAttempts } from "@/lib/actions/save-test-attempts";
import { toast } from "sonner";

export function TakeTestViewContainer({
  questions,
  totalTime,
  testId,
  previousAttemptId,
  attemptStatus,
}: TakeTestViewContainerProps) {
  const { setState } = useTakeTestStore;
  const { started, submited, setTestAnswers, testAnswers, hasAttempted } =
    useTakeTestStore();
  const { timeLeft, start, isDone: timeout, pause } = useTimer(totalTime);

  const completed = attemptStatus === "completed";

  useLayoutEffect(() => {
    setState({ hasAttempted: Boolean(previousAttemptId) });
  }, [previousAttemptId, setState]);

  const handleStart = () => {
    setState({ started: true, hasAttempted: false });
    start();
  };

  const handleSubmit = async () => {
    setState({ submited: true });

    if (!timeout) pause();

    const answers = Object.keys(testAnswers).map((questionId) => {
      const answer = testAnswers[questionId];
      const isFreeText = Boolean(answer.freeAnswer);
      return {
        questionId,
        isFreeText,
        answer: isFreeText ? answer.freeAnswer : answer.selected,
      };
    });

    const saved = await saveTestAttempts({
      testId,
      answers,
    });

    if (saved) {
      toast.success("Test attempt saved");
    } else {
      toast.error("Failed to save test attempt");
    }
  };

  const handleTestChange = (value: {
    answer: string;
    questionId: string;
    isFreeText: boolean;
  }) => {
    setTestAnswers(value);
  };

  return (
    <div className="space-y-4">
      {hasAttempted ? (
        <div>
          <p className="text-muted-foreground">
            You have already attempted this test.
          </p>
          <p className="text-muted-foreground">
            Please contact the instructor for more information, like on how to
            retake the test.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={handleStart}
              disabled={started}
              className={cn("transition-opacity", {
                "!opacity-0": started,
              })}
              size="sm"
            >
              Start
            </Button>
            <TimeProgress timeLeft={timeLeft} totalTime={totalTime} />
          </div>
          <div className="space-y-12">
            {questions?.map((question, index) => (
              <Fragment key={question.id}>
                {index + 1 > 1 && <Separator className="mb-8" />}
                <TakeTestListItem
                  title={!started ? "Please start the quiz" : ""}
                  onChange={handleTestChange}
                  index={index + 1}
                  key={question.id}
                  question={question}
                  readOnly={timeout || !started || submited}
                />
              </Fragment>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {started && (
              <>
                <Separator className="mt-24 mb-8" />
                <motion.div
                  className="space-y-4"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-muted-foreground">
                    Please make sure to review your answers before submitting.
                    Once you submit, you will not be able to change your
                    answers. Unless you retake the test.
                  </p>
                  <Button
                    disabled={submited}
                    onClick={handleSubmit}
                    size="lg"
                    className="w-full"
                  >
                    Submit
                  </Button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export type TakeTestViewContainerProps = {
  totalTime: number;
  testId: string;
  attemptStatus: string;
  questions: TestQuestion[];
  previousAttemptId?: string;
};
