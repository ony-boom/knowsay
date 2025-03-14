import { fetchQuizzesPage } from "@/app/api/quizzes/route";
import { Pagination } from "@/components/pagination";
import { QuizList } from "@/components/quizz/quiz-list";

type QuizListContainerProps = {
  props?: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function QuizListContainer({
  props,
}: QuizListContainerProps) {
  const searchParams = await props;

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const { totalPages } = await fetchQuizzesPage(query);

  return (
    <main className="flex-1">
      <QuizList query={query} currentPage={currentPage} />
      <div className="mt-8">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
