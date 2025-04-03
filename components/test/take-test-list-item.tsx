import { getTestQuestion } from "@/lib/actions/get-test-question";
import { TestQuestion } from "@/schemas/testQuestionSchema";

export async function TakeTestListItem({
  question,
}: {
  question: TestQuestion;
}) {
  const testQuestion = await getTestQuestion(question.id);

  console.log(testQuestion);

  return <div></div>;
}
