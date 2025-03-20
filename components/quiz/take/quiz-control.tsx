"use client";

import React from "react";
import { SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Button } from "@/components/ui/button";

export function QuizControl(props: QuizControlProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex">
        <p>Score:</p>
        <p className="ml-2 font-bold">{props.score}</p>
      </div>
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={props.onPrevious}
          disabled={props.currentQuestion === 1}
        >
          <SkipBack />
        </Button>
        <CircularProgress
          size="xs"
          thickness={6}
          value={props.currentQuestion}
          max={props.totalQuestions}
        >
          {props.currentQuestion}/{props.totalQuestions}
        </CircularProgress>
        <Button
          size="icon"
          variant="ghost"
          onClick={props.onNext}
          disabled={props.currentQuestion === props.totalQuestions}
        >
          <SkipForward />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={props.onReset}
        >
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}

export type QuizControlProps = React.ComponentProps<"div"> & {
  score: number;
  totalQuestions: number;
  currentQuestion: number;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
};
