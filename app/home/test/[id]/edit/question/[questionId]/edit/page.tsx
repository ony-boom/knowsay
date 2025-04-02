import { CreateQcmOptionsForm } from "@/components/quiz/edit/create-qcm-options-form";
import { Card } from "@/components/ui/card";
import { UpdateTestQcmForm } from "@/components/update-test-qcm-form";
import { getQcmOptions } from "@/lib/actions/get-qcm-options";
import { getTestQuestionWithQcm } from "@/lib/actions/get-test-question";
import { TestQuestionWithQcm } from "@/schemas/testQuestionSchema";

export default async function EditTestQuestionPage(props: {
  params: Promise<{
    questionId: string;
  }>;
}) {
  const { questionId } = await props.params;

  const question: TestQuestionWithQcm =
    await getTestQuestionWithQcm(questionId);

  const qcmOptions = await getQcmOptions(question.qcm_id);

  if (!question) {
    return (
      <div className="flex flex-col gap-6 px-6 py-8 pt-0">
        <h1 className="text-3xl font-black lg:text-5xl">
          Test Question Not Found
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
        <UpdateTestQcmForm initialData={question} />
      </Card>
      {!question.is_free_text ? (
        <CreateQcmOptionsForm
          qcm_id={question.qcm_id}
          questionId={question.id}
          initialData={qcmOptions}
        />
      ) : null}
    </div>
  );
}
