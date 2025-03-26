import { CreateQCMForm } from "@/components/quiz/edit/create-qcm-form";
import { Card } from "@/components/ui/card";

export default async function CreateQuestionPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CreateQCMForm quizId={id} />
      </Card>
    </div>
  );
}
