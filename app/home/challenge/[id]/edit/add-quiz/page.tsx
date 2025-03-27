import { QuizListForChallenge } from "@/components/challenge/quiz-list-for-challenge";
import { Pagination } from "@/components/pagination";
import { CategoryCardList } from "@/components/quiz/category-card";
import { CategoryCardSkeleton } from "@/components/quiz/category-card-skeleton";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";
import { SearchInput } from "@/components/search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQuizzes } from "@/lib/actions/get-quiz";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Page(props: {
  params: Promise<{ id: string }>;
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

  const { totalPages } = await getQuizzes(query, currentPage, category);

  const { id } = await props.params;

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pt-0 md:px-6 md:py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2 md:space-y-4">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            Add Quiz to Challenge
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Browse and select quizzes to include in your challenge.
          </p>
        </hgroup>

        <Link
          href="/quiz/create"
          className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring mt-2 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 md:mt-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your own quiz
        </Link>
      </div>

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
            <QuizListForChallenge
              query={query}
              currentPage={currentPage}
              categorySlug={category}
              challengeId={id}
            />
          </Suspense>
          <div className="mt-8">
            <Pagination totalPages={totalPages} />
          </div>
        </main>
      </div>
    </div>
  );
}
