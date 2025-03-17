import { SearchInput } from "@/components/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { fetchQuizzesPage } from "@/app/api/quizzes/route";
import { Pagination } from "@/components/pagination";
import { QuizList } from "@/components/quiz/quiz-list";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";
import { CategoryCard } from "@/components/quiz/category-card";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  const currentPage = Number(searchParams?.page) || 1;
  const { totalPages } = await fetchQuizzesPage(query);

  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 space-y-6 md:w-64">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput />
          </CardContent>
        </Card>
        <CategoryCard />
      </aside>

      <main className="flex-1">
        <Suspense key={query + currentPage} fallback={<QuizListSkeleton />}>
          <QuizList query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
