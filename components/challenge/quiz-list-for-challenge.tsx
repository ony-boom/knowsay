import { getQuizzes } from "@/lib/actions/get-quiz";
import { Suspense } from "react";
import { QuizListSkeleton } from "../quiz/quiz-list-skeleton";
import { QuizListForChallengeItem } from "./quiz-list-for-challenge-item";

interface QuizListForChallengeProps {
  query: string;
  currentPage: number;
  categorySlug?: string;
  challengeId?: string;
}

export async function QuizListForChallenge({
  query,
  currentPage,
  categorySlug,
  challengeId,
}: QuizListForChallengeProps) {
  const { quizzes } = await getQuizzes(query, currentPage, categorySlug);

  return (
    <Suspense
      key={query + currentPage + categorySlug}
      fallback={<QuizListSkeleton />}
    >
      {quizzes.length > 0 ? (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizListForChallengeItem
              key={quiz.quiz_id}
              quizId={quiz.quiz_id}
              title={quiz.title}
              description={quiz.description || "No description available"}
              category={quiz.categories.name}
              difficulty={quiz.difficulty}
              createdAt={new Date(quiz.created_at).toLocaleDateString()}
              challengeId={challengeId}
            />
          ))}
        </div>
      ) : (
        <div className="grid h-full place-items-center py-8">
          <p className="text-foreground/60">
            No quizzes found. Try a different search query or category.
          </p>
        </div>
      )}
    </Suspense>
  );
}
