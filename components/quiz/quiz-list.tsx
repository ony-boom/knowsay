import { fetchFilteredQuizzes } from "@/app/api/quizzes/route";
import { QuizListItem } from "./quiz-list-item";

interface QuizListProps {
  query: string;
  currentPage: number;
  categorySlug?: string;
}

export async function QuizList({
  query,
  currentPage,
  categorySlug,
}: QuizListProps) {
  const { quizzes } = await fetchFilteredQuizzes(
    query,
    currentPage,
    categorySlug,
  );

  console.log("category slug:", categorySlug);

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <QuizListItem
          key={quiz.id}
          quizId={quiz.id}
          title={quiz.title}
          description={quiz.description || "No description available"}
          category={quiz.categories.name}
          difficulty={quiz.difficulty}
          createdAt={new Date(quiz.created_at).toLocaleDateString()}
        />
      ))}
    </div>
  );
}
