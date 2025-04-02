import { CreateQcmOptionsForm } from "@/components/quiz/edit/create-qcm-options-form";
import { UpdateQuizQcmForm } from "@/components/quiz/edit/update-quiz-qcm-form";
import { Card } from "@/components/ui/card";
import { getQcmOptions } from "@/lib/actions/get-qcm-options";
import { getQuizQuestionWithQcm } from "@/lib/actions/get-quiz-question";

export default async function EditQuizQuestionPage(props: {
  params: Promise<{
    questionId: string;
  }>;
}) {
  const { questionId } = await props.params;

  const question = await getQuizQuestionWithQcm(questionId);

  const qcmOptions = await getQcmOptions(question.qcm_id);

  if (!question) {
    return (
      <div className="flex flex-col gap-6 px-6 py-8 pt-0">
        <h1 className="text-3xl font-black lg:text-5xl">
          Quiz Question Not Found
        </h1>
        <p className="text-foreground/80 text-lg">
          The question you&apos;re trying to edit doesn&apos;t exist or was
          deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <UpdateQuizQcmForm initialData={question} />
      </Card>
      <CreateQcmOptionsForm
        qcm_id={question.qcm_id}
        questionId={question.id}
        initialData={qcmOptions}
      />
    </div>
  );
}
