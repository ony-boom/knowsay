import { QuizListContainer } from "@/components/quizz/quizz-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function Page() {
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 space-y-6 md:w-64">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search quizzes..."
                className="pl-8"
              />
            </div>
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
        <QuizListContainer />
        {/* <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div> */}
      </main>
    </div>
  );
}
