import { QuestionsManager } from "@/components/quiz/create/question-manager";
import { EditQuizForm } from "@/components/quiz/edit/edit-quiz-form";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { getQuizById } from "@/lib/actions/fetch-quiz";
import { getCategories } from "@/lib/actions/get-categories";
import { getQuestionsByQuiz } from "@/lib/actions/get-questions";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [quiz, categories, questions] = await Promise.all([
    getQuizById(id),
    getCategories(),
    getQuestionsByQuiz(id),
  ]);

  console.log("questions", questions);

  if (!quiz || !questions) {
    return (
      <div className="flex flex-col gap-6 px-6 py-8 pt-0">
        <h1 className="text-3xl font-black lg:text-5xl">Data Not Found</h1>
        <p className="text-foreground/80 text-lg">
          The data you&apos;re trying to edit doesn&apos;t exist or was deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-8 pt-0">
      <hgroup className="space-y-4">
        <h1 className="text-3xl font-black lg:text-5xl">Edit Quiz</h1>
        <p className="text-foreground/80 text-lg">
          Update your quiz details and questions to improve the experience for
          your participants.
        </p>
      </hgroup>

      {/* edit quiz form */}
      <Collapsible className="w-full rounded-lg border" defaultOpen>
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Quiz Details</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <EditQuizForm categories={categories} initialData={quiz} />
        </CollapsibleContent>
      </Collapsible>

      {/* edit questions */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Edit Questions</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <p className="text-foreground/80 mt-4 text-lg">
            Update your quiz questions or add new ones. Changes are saved
            automatically.
          </p>
          <QuestionsManager initialQuestions={questions} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
