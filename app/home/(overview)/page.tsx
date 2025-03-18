import { SearchInput } from "@/components/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Pagination } from "@/components/pagination";
import { QuizList } from "@/components/quiz/quiz-list";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";
import { CategoryCardList } from "@/components/quiz/category-card";
import { CategoryCardSkeleton } from "@/components/quiz/category-card-skeleton";
import { fetchQuizzes } from "@/app/api/quizzes/route";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const category = searchParams?.category || "";

  const currentPage = Number(searchParams?.page) || 1;

  const { totalPages } = await fetchQuizzes(query, currentPage, category);

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

        <Suspense fallback={<CategoryCardSkeleton />}>
          <CategoryCardList />
        </Suspense>
      </aside>

      <main className="flex-1">
        <Suspense
          key={query + currentPage + category}
          fallback={<QuizListSkeleton />}
        >
          <QuizList
            query={query}
            currentPage={currentPage}
            categorySlug={category}
          />
        </Suspense>
        <div className="mt-8">
          <Pagination totalPages={totalPages} />
        </div>
      </main>
    </div>
  );
}
