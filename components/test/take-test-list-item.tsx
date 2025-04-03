import QuestionView from "@/components/question-view";
import { TestQuestion } from "@/schemas/testQuestionSchema";
import { getTestQuestion } from "@/lib/actions/get-test-question";
import { QcmAnswer } from "@/components/qcm-answer";
import { TakeTestOpenAnswerField } from "@/components/test/take-test-open-answer-field";
import { Separator } from "@/components/ui/separator";

export async function TakeTestListItem({
  question,
  index,
}: {
  question: TestQuestion;
  index: number;
}) {
  const testQuestion = await getTestQuestion(question.id);

  return (
    <>
      <div className="space-y-4">
        {index > 1 && <Separator />}
        <div className="space-y-2">
          <p className="bg-primary/10 text-primary w-max rounded-full px-3 py-1 text-xs font-medium">
            Question {index}
          </p>
          <QuestionView initialContent={testQuestion.qcm.question} />
        </div>

        <TestAnswerListItem question={question} />
      </div>
    </>
  );
}

const TestAnswerListItem = async ({ question }: { question: TestQuestion }) => {
  if (question.is_free_text) {
    return <TakeTestOpenAnswerField />;
  }

  return <QcmAnswer questionId={question.qcm_id} />;
};
