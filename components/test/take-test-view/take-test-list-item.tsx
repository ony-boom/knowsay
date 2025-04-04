"use client";

import useSWR from "swr";
import { swrFetcher } from "@/lib/utils";
import QuestionView from "@/components/question-view";
import { TestQuestion } from "@/schemas/testQuestionSchema";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TakeTestOpenAnswerField } from "../take-test-open-answer-field";
import { QcmAnswer } from "@/components/qcm-answer";

export function TakeTestListItem({
  question,
  index,
  readOnly,
}: TakeTestListItemProps) {
  const { data: testQuestion, isLoading } = useSWR(
    `/api/tests/${question.test_id}/questions/${question.id}`,
    swrFetcher,
  );

  if (!testQuestion) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        {index > 1 && <Separator className="mb-8" />}
        <div className="space-y-2">
          <p className="bg-primary/10 text-primary w-max rounded-full px-3 py-1 text-xs font-medium">
            Question {index}
          </p>

          {isLoading ? (
            <Skeleton className="h-2 w-full" />
          ) : (
            <QuestionView initialContent={testQuestion.qcm.question} />
          )}
        </div>

        {question.is_free_text ? (
          <TakeTestOpenAnswerField readOnly={readOnly} />
        ) : (
          <QcmAnswer readOnly={readOnly} questionId={question.qcm_id} />
        )}
      </div>
    </>
  );
}

export type TakeTestListItemProps = {
  question: TestQuestion;
  index: number;
  readOnly?: boolean;
};
