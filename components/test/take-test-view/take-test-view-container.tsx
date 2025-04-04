"use client";

import { TestQuestion } from "@/schemas/testQuestionSchema";
import { TakeTestListItem } from "./take-test-list-item";
import { useTimer } from "@/hooks/use-timer";
import { TimeProgress } from "@/components/time-progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function TakeTestViewContainer({
  questions,
  totalTime,
}: TakeTestViewContainerProps) {
  const [started, setStarted] = useState(false);
  const { timeLeft, start, isDone: timeout } = useTimer(totalTime);

  const handleStart = () => {
    setStarted(true);
    start();
  };

  return (
    <div className="space-y-4">
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
          <TakeTestListItem
            index={index + 1}
            key={question.id}
            readOnly={timeout}
            question={question}
          />
        ))}
      </div>

      <Button size="lg" className="mt-12 w-full">
        Submit
      </Button>
    </div>
  );
}

export type TakeTestViewContainerProps = {
  totalTime: number;
  questions: TestQuestion[];
};
