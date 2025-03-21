"use client";

import { Progress } from "@/components/ui/progress";
import React from "react";

export function QuizScoreDisplay(props: QuizScoreDisplayProps) {
  return (
    <div className="bg-background border-border sticky -top-9 z-20 flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-start">
      <div className="w-full space-y-2">
        <small className="block">
          Question {props.currentQuestion}/{props.totalQuestions}
        </small>
        <Progress
          className="bg-primary-foreground"
          value={props.currentQuestion * 100}
          max={props.totalQuestions}
        />
      </div>

      <p className="bg-accent w-full shrink-0 grow rounded-full p-2 text-sm sm:mt-3 sm:w-max">
        🏆 Score: {props.score}
      </p>
    </div>
  );
}

export type QuizScoreDisplayProps = React.ComponentProps<"div"> & {
  score: number;
  totalQuestions: number;
  currentQuestion: number;
};
