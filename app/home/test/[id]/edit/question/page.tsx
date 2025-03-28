import { CreateTestQCMForm } from "@/components/create-test-qcm-form";
import { Card } from "@/components/ui/card";

export default async function CreateTestQuestionPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CreateTestQCMForm testId={id} />
      </Card>
    </div>
  );
}
