import React, { Suspense } from "react";
import { getUserQuizzes } from "@/lib/actions/get-user-quiz";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UserQuizListItem } from "@/components/user-quiz-list-item";
import { getTranslations } from "next-intl/server";

export default async function MyQuizPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
  }>;
}) {
  const t = await getTranslations("myQuiz");
  const params = await props.searchParams;
  const query = params?.query || "";

  const { quizzes } = await getUserQuizzes(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            {t("description")}
          </p>
        </hgroup>
        <Link
          href="/home/quiz/create"
          className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("createButton")}
        </Link>
      </div>

      <Suspense fallback={<QuizListSkeleton />}>
        {quizzes.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <UserQuizListItem
                key={quiz.quiz_id}
                quizId={quiz.quiz_id}
                title={quiz.title}
                description={quiz.description || "No description available"}
                category={quiz.categories.name}
                difficulty={quiz.difficulty}
                createdAt={new Date(quiz.created_at).toLocaleDateString()}
              />
            ))}
          </div>
        ) : (
          <div className="grid h-full place-items-center py-8">
            <p className="text-muted-foreground">{t("empty")}</p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
