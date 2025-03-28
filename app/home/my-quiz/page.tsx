import React, { Suspense } from "react";
import { getUserQuizzes } from "@/lib/actions/get-user-quiz";
import { QuizListItem } from "@/components/quiz/quiz-list-item";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";

export default async function MyQuizPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
  }>;
}) {
  const params = await props.searchParams;
  const query = params?.query || "";

  const { quizzes } = await getUserQuizzes(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            My Quizzes
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Review and manage the quizzes you&apos;ve created.
          </p>
        </hgroup>
      </div>

      <Suspense fallback={<QuizListSkeleton />}>
        {quizzes.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <QuizListItem
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
            <p className="text-muted-foreground">
              You haven&apos;t created any quizzes yet. Start building your quiz
              collection now!
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
