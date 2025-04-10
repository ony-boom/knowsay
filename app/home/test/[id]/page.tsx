import { getTestById } from "@/lib/actions/get-test";
import { getTestQuestions } from "@/lib/actions/get-test-question";
import { notFound } from "next/navigation";
import { TakeTestViewContainer } from "@/components/test/take-test-view/take-test-view-container";
import { getUserTestAttempt } from "@/lib/actions/get-user-test-attempt";

export default async function TestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const testId = (await params).id;
  const test = await getTestById(testId);

  if (!test) {
    return notFound();
  }

  const { questions } = await getTestQuestions(testId, 1, 10, false);
  const totalTime = questions.reduce(
    (acc, question) => acc + (question.time_limit ?? 0),
    0,
  );

  const { attempts } = await getUserTestAttempt(testId);

  return (
    <div className="space-y-8">
      <hgroup className="space-y-2">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <p className="text-gray-600">{test.description}</p>
      </hgroup>

      <TakeTestViewContainer
        testId={testId}
        attemptStatus={attempts?.status ?? "not_started"}
        questions={questions}
        totalTime={totalTime}
        previousAttemptId={attempts?.id}
      />
    </div>
  );
}
