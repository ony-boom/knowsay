import { QuizzListItem } from "@/components/quizz/quizz-list-item";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default async function Page() {
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 space-y-6 md:w-64">
        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-medium">Search</h3>
          <div className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              placeholder="Search quizzes..."
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-2 pr-3 pl-8 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>

        <div className="rounded-lg border p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-medium">Categories</h3>
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
                <button className="hover:bg-muted group flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm transition-colors">
                  {category}
                  <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                    {Math.floor(Math.random() * 20) + 1}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1">
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 10 }).map((_, index) => (
            <QuizzListItem
              key={index}
              title={`Sample Quiz ${index + 1}`}
              description="This is a sample quiz description"
              category="General Knowledge"
              difficulty="Medium"
              createdAt="2023-07-15"
            />
          ))}
        </div>

        <div className="mt-8">
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
        </div>
      </main>
    </div>
  );
}
