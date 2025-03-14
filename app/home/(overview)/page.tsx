import { SearchInput } from "@/components/search";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import QuizListContainer from "../components/quiz-list-container";
import { Suspense } from "react";
import { QuizListItemSkeleton } from "@/components/quizz/quiz-list-item-skeleton";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
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

      <Suspense fallback={<QuizListItemSkeleton />}>
        <QuizListContainer props={props.searchParams} />
      </Suspense>
    </div>
  );
}
