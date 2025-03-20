"use client";

import { z } from "zod";
import { Label } from "@/components/ui/label";
import { AnswerSchema } from "@/schemas/answerSchema";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { swrFetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { Button } from "@/components/ui/button";

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
            return (
              <div
                className={cn(
                  "hover:bg-accent group has-[button[aria-checked='true']]:bg-primary/5 has-[button[aria-checked='true']]:border-primary border-border bg-card relative flex items-center gap-4 rounded-md border p-3 transition-all",
                  {
                    "!border-green-800 !bg-green-800/10":
                      props.readOnly &&
                      correctAnswer?.content === answer.content,
                  },
                  {
                    "!border-red-800 !bg-red-800/10":
                      props.readOnly &&
                      correctAnswer?.content !== answer.content &&
                      value === answer.content,
                  },
                )}
                key={answer.id}
              >
                <RadioGroupItem
                  disabled={props.readOnly}
                  value={answer.content}
                  id={answer.id}
                  className={cn({
                    "fill-green-800 text-primary": props.readOnly && correctAnswer?.content === answer.content,
                    "fill-red-800 text-primary": props.readOnly && correctAnswer?.content !== answer.content && value === answer.content,
                  })}
                />
                <Label
                  className={cn("w-full cursor-pointer font-medium", {
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
        disabled={props.readOnly}
        className="w-full sm:w-max"
        onClick={handleSubmit}
      >
        {props.readOnly ? "Answered" : "Submit"}
      </Button>

      {props.readOnly && <small>Reset the quiz to answer again</small>}
    </div>
  );
}

type Answer = z.infer<typeof AnswerSchema>;

export type QcmAnswerProps = React.ComponentProps<typeof RadioGroup> & {
  questionId: string;
  onAnswerSubmitted: (isCorrect: boolean) => void;
  readOnly?: boolean;
};
