import { SearchInput } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { fetchQuizzesPage } from "@/app/api/quizzes/route";
import { Pagination } from "@/components/pagination";
import { QuizList } from "@/components/quiz/quiz-list";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";

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

        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "General Knowledge",
                "Science",
                "History",
                "Geography",
                "Entertainment",
                "Sports",
                "Technology",
              ].map((category) => (
                <li key={category}>
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-between px-2 py-1 text-left text-sm"
                  >
                    {category}
                    <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                      {Math.floor(Math.random() * 20) + 1}
                    </span>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
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
