import { CreateQuizQCMForm } from "@/components/quiz/edit/create-quiz-qcm-form";
import { Card } from "@/components/ui/card";

export default async function CreateQuizQuestionPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CreateQuizQCMForm quizId={id} />
      </Card>
    </div>
  );
}
