import { EditQuestionForm } from "@/components/quiz/edit/edit-question-form";
import { Card } from "@/components/ui/card";
import { getQuizById } from "@/lib/actions/fetch-quiz";

export default async function CreateQuestionPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  const quiz = await getQuizById(id);

  if (!quiz) {
    return (
      <div className="flex flex-col gap-6 px-6 py-8 pt-0">
        <h1 className="text-3xl font-black lg:text-5xl">Quiz Not Found</h1>
        <p className="text-foreground/80 text-lg">
          The quiz you&apos;re trying to edit doesn&apos;t exist or was deleted.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <EditQuestionForm initialData={quiz} />
    </Card>
  );
}
