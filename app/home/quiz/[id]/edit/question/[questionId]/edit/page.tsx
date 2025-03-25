import { UpdateQcmForm } from "@/components/quiz/edit/update-qcm-form";
import { Card } from "@/components/ui/card";
import { getQuizQuestionWithQcm } from "@/lib/actions/get-quiz-question";

export default async function EditQuestionPage(props: {
  params: Promise<{
    questionId: string;
  }>;
}) {
  const { questionId } = await props.params;

  const question = await getQuizQuestionWithQcm(questionId);

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
      <UpdateQcmForm initialData={question} />
    </Card>
  );
}
