import { QuizQuestionsManager } from "@/components/quiz/create/quiz-question-manager";
import { EditQuizForm } from "@/components/quiz/edit/edit-quiz-form";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { getQuizById } from "@/lib/actions/get-quiz";
import { getCategories } from "@/lib/actions/get-categories";
import { getTranslations } from "next-intl/server";
import { getAllQuizQuestionsWithQcm } from "@/lib/actions/get-quiz-question";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const t = await getTranslations("quiz.edit");

  const [quiz, categories, questions] = await Promise.all([
    getQuizById(id),
    getCategories(),
    getAllQuizQuestionsWithQcm(id),
  ]);

  if (!quiz || !questions) {
    return (
      <div className="flex flex-col gap-6 px-6 py-8 pt-0">
        <h1 className="text-3xl font-black lg:text-5xl">
          {t("notFound.title")}
        </h1>
        <p className="text-foreground/80 text-lg">
          {t("notFound.description")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-8 pt-0">
      <hgroup className="space-y-4">
        <h1 className="text-3xl font-black lg:text-5xl">{t("title")}</h1>
        <p className="text-foreground/80 text-lg">{t("description")}</p>
      </hgroup>

      {/* edit quiz form */}
      <Collapsible className="w-full rounded-lg border" defaultOpen>
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>{t("sections.details")}</span>
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
            <span>{t("sections.questions")}</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <p className="text-foreground/80 mt-4 text-lg">
            {t("sections.questionsDescription")}
          </p>
          <QuizQuestionsManager initialQuestions={questions} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
