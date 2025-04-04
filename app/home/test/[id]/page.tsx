import { getTestById } from "@/lib/actions/get-test";
import { getTestQuestions } from "@/lib/actions/get-test-question";
import { notFound } from "next/navigation";
import { TakeTestListItem } from "@/components/test/take-test-list-item";

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

  return (
    <div className="space-y-8">
      <hgroup className="space-y-2">
        <h1 className="text-2xl font-bold">{test.title}</h1>
        <p className="text-gray-600">{test.description}</p>
      </hgroup>

      <div className="space-y-12">
        {questions?.map((question, index) => (
          <TakeTestListItem
            index={index + 1}
            key={question.id}
            question={question}
          />
        ))}
      </div>
    </div>
  );
}
