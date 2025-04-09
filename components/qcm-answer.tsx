"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { swrFetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { QCMOptionArray } from "@/schemas/qcmOptionSchema";
import Image from "next/image";
import React, { useEffect } from "react";
import { useTakeQuizState } from "@/hooks/use-take-quiz-state";

export function QcmAnswer(props: QcmAnswerProps) {
  const { questionId, onAnswerChange, passIdOnAnswerChange, ...divProps } =
    props;
  const { selectedAnswers, setSelectedAnswer } = useTakeQuizState();

  const selectedValue = selectedAnswers[questionId]?.value;
  const readOnly = props.readOnly;

  const {
    data: answers,
    isLoading,
    error,
  } = useSWR<QCMOptionArray>(
    `/api/questions/answers/${questionId}`,
    swrFetcher,
  );

  const correctAnswer = answers?.find((answer) => answer.is_correct);

  useEffect(() => {
    if (!props.defaultValue) return;
    setSelectedAnswer(
      questionId,
      props.defaultValue,
      passIdOnAnswerChange
        ? correctAnswer?.option_id === props.defaultValue
        : correctAnswer?.option_text === props.defaultValue,
    );
  }, [
    correctAnswer?.option_id,
    correctAnswer?.option_text,
    passIdOnAnswerChange,
    props.defaultValue,
    questionId,
    setSelectedAnswer,
  ]);

  const handleCheck = (value: string) => {
    onAnswerChange?.(value);
    if (!readOnly) {
      setSelectedAnswer(
        questionId,
        value,
        passIdOnAnswerChange
          ? correctAnswer?.option_id === value
          : correctAnswer?.option_text === value,
      );
    }
  };

  if (error) {
    return (
      <div className="flex justify-center p-4 text-red-500">
        Failed to load answers. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Skeleton className="h-16 w-full p-6" key={index} />
          ))}
      </div>
    );
  }

  if (!answers?.length) {
    return (
      <div className="text-muted-foreground flex justify-center p-4">
        No answers available for this question.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-8">
      <RadioGroup
        onValueChange={handleCheck}
        value={selectedValue}
        {...divProps}
        className={cn("w-full", props.className)}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {answers.map((answer, index) => {
            const answerValue = passIdOnAnswerChange
              ? answer.option_id
              : answer.option_text!;

            const isSelected = selectedValue === answerValue;
            const isCorrectAnswer =
              correctAnswer?.option_text === answer.option_text;
            const isCorrectSelection =
              isSelected && isCorrectAnswer && readOnly;
            const isIncorrectSelection =
              isSelected && !isCorrectAnswer && readOnly;

            return (
              <div
                className={cn(
                  "border-border relative flex cursor-pointer items-center rounded-lg border p-5 shadow-sm transition-all",
                  {
                    "hover:bg-secondary/40": !readOnly,
                    "bg-secondary border-primary shadow-md":
                      isSelected && !readOnly,
                    "border-green-600 bg-green-50 shadow-md dark:bg-green-950/30":
                      isCorrectSelection,
                    "border-red-600 bg-red-50 shadow-md dark:bg-red-950/30":
                      isIncorrectSelection,
                  },
                )}
                key={answer.option_id}
                onClick={() => !readOnly && handleCheck(answerValue)}
              >
                <div
                  className={cn(
                    "border-muted-foreground relative mr-4 h-6 w-6 flex-shrink-0 rounded-full border transition-all",
                    {
                      "border-primary border-[5px]": isSelected && !readOnly,
                      "border-[5px] border-green-600": isCorrectSelection,
                      "border-[5px] border-red-600": isIncorrectSelection,
                    },
                  )}
                >
                  <RadioGroupItem
                    className="sr-only"
                    disabled={readOnly}
                    value={answer.option_text!}
                    id={answer.option_id}
                  />
                </div>
                <Label
                  className={cn("w-full cursor-pointer text-base font-medium", {
                    "pointer-events-none": readOnly,
                    "text-primary": isSelected && !readOnly,
                    "text-green-700 dark:text-green-400": isCorrectSelection,
                    "text-red-700 dark:text-red-400": isIncorrectSelection,
                  })}
                  htmlFor={answer.option_id}
                >
                  {answer.option_image_url ? (
                    <Image
                      height={60}
                      width={60}
                      className="object-cover"
                      src={answer.option_image_url}
                      alt={`Option ${index + 1}`}
                    />
                  ) : (
                    answer.option_text
                  )}
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}

export type QcmAnswerProps = React.ComponentProps<typeof RadioGroup> & {
  questionId: string;
  readOnly?: boolean;
  passIdOnAnswerChange?: boolean;
  defaultValue?: string;
  onAnswerChange?: (answer: string) => void;
};
