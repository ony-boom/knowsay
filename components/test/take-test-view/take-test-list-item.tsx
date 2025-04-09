"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/utils";
import QuestionView from "@/components/question-view";
import { TestQuestion } from "@/schemas/testQuestionSchema";
import { Skeleton } from "@/components/ui/skeleton";
import { TakeTestOpenAnswerField } from "../take-test-open-answer-field";
import { QcmAnswer } from "@/components/qcm-answer";
import { ComponentProps } from "react";

export function TakeTestListItem({
  question,
  index,
  readOnly,
  onChange,
  ...restProps
}: TakeTestListItemProps) {
  const {
    data: testQuestion,
    isLoading,
    error,
  } = useSWR(
    `/api/tests/${question.test_id}/questions/${question.id}`,
    swrFetcher,
    { revalidateOnFocus: false },
  );

  const handleChange = (value: string) => {
    if (readOnly) return;

    onChange({
      answer: value,
      isFreeText: question.is_free_text,
      questionId: question.id,
    });
  };

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
        <p className="text-red-600 dark:text-red-400">
          Failed to load question data
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="bg-primary/10 text-primary w-max rounded-full px-3 py-1 text-xs font-medium">
            Question {index}
          </p>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, idx) => (
              <Skeleton className="h-16 w-full rounded-lg" key={idx} />
            ))}
        </div>
      </div>
    );
  }

  if (!testQuestion) {
    return null;
  }

  return (
    <div {...restProps} className="space-y-4">
      <div className="space-y-2">
        <p className="bg-primary/10 text-primary w-max rounded-full px-3 py-1 text-xs font-medium">
          Question {index}
        </p>
        <QuestionView initialContent={testQuestion.qcm.question} />
      </div>

      {question.is_free_text ? (
        <TakeTestOpenAnswerField
          readOnly={readOnly}
          onChange={(block) => handleChange(JSON.stringify(block))}
        />
      ) : (
        <QcmAnswer
          onAnswerChange={handleChange}
          passIdOnAnswerChange
          readOnly={readOnly}
          questionId={question.qcm_id}
        />
      )}
    </div>
  );
}

export type TakeTestListItemProps = Omit<ComponentProps<"div">, "onChange"> & {
  question: TestQuestion;
  index: number;
  readOnly?: boolean;
  onChange: (params: {
    answer: string;
    isFreeText: boolean;
    questionId: string;
  }) => void;
};
