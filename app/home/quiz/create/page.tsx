import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CreateQuizForm } from "@/components/quiz/create/create-quiz-form";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Flame, Plus } from "lucide-react";
import { getCategories } from "@/lib/actions/get-categories";
import { getTranslations } from "next-intl/server";

export default async function CreateQuizPage() {
  const t = await getTranslations("quiz.create");
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6 px-6 py-8 pt-0">
      <hgroup className="space-y-4">
        <h1 className="text-3xl font-black lg:text-5xl">{t("title")}</h1>
        <p className="text-foreground/80 text-lg">{t("description")}</p>
      </hgroup>

      {/* create quiz form */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>{t("form")}</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <CreateQuizForm categories={categories} />
        </CollapsibleContent>
      </Collapsible>

      {/* create questions */}
      <div className="bg-muted/40 w-full rounded-lg border">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-primary/10 mb-4 rounded-full p-3">
            <Flame className="text-primary h-6 w-6" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">
            {t("questionsSection.title")}
          </h3>
          <p className="text-foreground/70 mb-6 max-w-md">
            {t("questionsSection.description")}
          </p>
          <Button disabled variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("questionsSection.button")}
          </Button>
        </div>
      </div>
    </div>
  );
}
