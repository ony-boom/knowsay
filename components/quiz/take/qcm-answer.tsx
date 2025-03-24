"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { swrFetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Answer } from "@/schemas/answerSchema";

export function QcmAnswer(props: QcmAnswerProps) {
  const [value, setValue] = useState<string>();

  const { questionId, onAnswerSubmitted, ...divProps } = props;
  const { data: answers, isLoading } = useSWR<Answer[]>(
    `/api/questions/answers/${questionId}`,
    swrFetcher,
  );

  if (answers?.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center">
        <p>
          Looks like the creator of this quiz hasn&#39;t added any answers yet.
          That&#39;s a bummer. 😔
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {Array(4)
          .fill(1)
          .map((_, index) => (
            <Skeleton className="w-full p-6" key={index} />
          ))}
      </div>
    );
  }

  const correctAnswer = answers?.find((answer) => answer.is_correct);

  const handleCheck = (value: string) => {
    setValue(value);
  };

  const handleSubmit = () => {
    const isCorrect = correctAnswer?.content === value;
    onAnswerSubmitted(isCorrect);
  };

  return (
    <div className="flex flex-col items-end gap-8">
      <RadioGroup
        onValueChange={handleCheck}
        {...divProps}
        className={cn("w-full", props.className)}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {answers?.map((answer) => {
            const isSelected = value === answer.content;
            const isCorrectAnswer = correctAnswer?.content === answer.content;
            const isIncorrectSelection =
              isSelected && !isCorrectAnswer && props.readOnly;
            const isCorrectSelection =
              isSelected && isCorrectAnswer && props.readOnly;

            return (
              <div
                className={cn(
                  "border-border hover:bg-secondary relative flex cursor-pointer items-center rounded-md border p-4 transition-all",
                  {
                    "bg-secondary border-ring": isSelected && !props.readOnly,
                    "border-green-600 bg-green-50 dark:bg-green-950/20":
                      isCorrectSelection,
                    "border-red-600 bg-red-50 dark:bg-red-950/20":
                      isIncorrectSelection,
                  },
                )}
                key={answer.id}
                onClick={() => !props.readOnly && handleCheck(answer.content)}
              >
                <div
                  className={cn(
                    "border-muted-foreground relative mr-3.5 h-5 w-5 flex-shrink-0 rounded-full border",
                    {
                      "border-ring border-4": isSelected && !props.readOnly,
                      "border-4 border-green-600": isCorrectSelection,
                      "border-4 border-red-600": isIncorrectSelection,
                    },
                  )}
                >
                  <RadioGroupItem
                    className="sr-only"
                    disabled={props.readOnly}
                    value={answer.content}
                    id={answer.id}
                  />
                </div>
                <Label
                  className={cn("w-full cursor-pointer font-normal", {
                    "pointer-events-none": props.readOnly,
                  })}
                  htmlFor={answer.id}
                >
                  {answer.content}
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      <Button
        variant="secondary"
        className="w-full sm:w-max"
        onClick={handleSubmit}
      >
        Check
      </Button>
    </div>
  );
}

export type QcmAnswerProps = React.ComponentProps<typeof RadioGroup> & {
  questionId: string;
  onAnswerSubmitted: (isCorrect: boolean) => void;
  readOnly?: boolean;
};
