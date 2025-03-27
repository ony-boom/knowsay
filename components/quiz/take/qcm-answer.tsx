"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { swrFetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import { QCMOptionArray } from "@/schemas/qcmOptionSchema";
import { useTakeQuizState } from "@/hooks/use-take-quiz-state";

export function QcmAnswer(props: QcmAnswerProps) {
  const { questionId, onAnswerChange, ...divProps } = props;
  const { selectedAnswers, setSelectedAnswer } = useTakeQuizState();

  const selectedValue = selectedAnswers[questionId]?.value;
  const readOnly = props.readOnly;

  const { data: answers, isLoading } = useSWR<QCMOptionArray>(
    `/api/questions/answers/${questionId}`,
    swrFetcher,
  );

  // Find the correct answer
  const correctAnswer = answers?.find((answer) => answer.is_correct);

  const handleCheck = (value: string) => {
    onAnswerChange?.(questionId);
    if (!readOnly) {
      setSelectedAnswer(
        questionId,
        value,
        correctAnswer?.option_text === value,
      );
    }
  };

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

  return (
    <div className="flex flex-col items-end gap-8">
      <RadioGroup
        onValueChange={handleCheck}
        value={selectedValue}
        {...divProps}
        className={cn("w-full", props.className)}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {answers?.map((answer) => {
            const isSelected = selectedValue === answer.option_text;
            const isCorrectAnswer =
              correctAnswer?.option_text === answer.option_text;
            const isIncorrectSelection =
              isSelected && !isCorrectAnswer && readOnly;
            const isCorrectSelection =
              isSelected && isCorrectAnswer && readOnly;

            return (
              <div
                className={cn(
                  "border-border hover:bg-secondary/40 relative flex cursor-pointer items-center rounded-lg border p-5 shadow-sm transition-all",
                  {
                    "bg-secondary border-primary shadow-md":
                      isSelected && !readOnly,
                    "border-green-600 bg-green-50 shadow-md dark:bg-green-950/30":
                      isCorrectSelection,
                    "border-red-600 bg-red-50 shadow-md dark:bg-red-950/30":
                      isIncorrectSelection,
                  },
                )}
                key={answer.option_id}
                onClick={() => !readOnly && handleCheck(answer.option_text!)}
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
                  {answer.option_text}
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
  onAnswerChange?: (answer: string) => void;
};
