import { CreateQuestionForm } from "@/components/quiz/edit/create-question-form";
import { Card } from "@/components/ui/card";

export default async function CreateQuestionPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  return (
    <Card>
      <CreateQuestionForm quizId={id} />
    </Card>
  );
}
