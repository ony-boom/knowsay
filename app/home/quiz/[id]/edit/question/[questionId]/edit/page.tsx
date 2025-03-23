import { EditQuestionForm } from "@/components/quiz/edit/edit-question-form";
import { Card } from "@/components/ui/card";
import { getQuestion } from "@/lib/actions/get-questions";

export default async function EditQuestionPage(props: {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
}) {
  const { id, questionId } = await props.params;

  const question = await getQuestion(questionId);

  if (!question) {
    return (
      <div className="flex flex-col gap-6 px-6 py-8 pt-0">
        <h1 className="text-3xl font-black lg:text-5xl">Question Not Found</h1>
        <p className="text-foreground/80 text-lg">
          The question you&apos;re trying to edit doesn&apos;t exist or was
          deleted.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <EditQuestionForm quizId={id} initialData={question} />
    </Card>
  );
}
