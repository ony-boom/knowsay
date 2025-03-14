import { QuizzListItem } from "./quizz-list-item";
import { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { QuizzListItemSkeleton } from "./quizz-list-item-skeleton";
import { getQuizzes } from "@/app/api/quizzes/route";

interface QuizListProps {
  page?: number;
  pageSize?: number;
}

export async function QuizList({ page = 1, pageSize = 9 }: QuizListProps) {
  const { quizzes, totalCount } = await getQuizzes(page, pageSize);
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <QuizzListItem
            key={quiz.id}
            title={quiz.title}
            description={quiz.description || "No description available"}
            category={quiz.category}
            difficulty={quiz.difficulty}
            createdAt={new Date(quiz.created_at).toLocaleDateString()}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href={`/quizzes?page=${page - 1}`} />
              </PaginationItem>
            )}

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href={`/quizzes?page=${i + 1}`}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {page < totalPages && (
              <PaginationItem>
                <PaginationNext href={`/quizzes?page=${page + 1}`} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

export function QuizListContainer({ page = 1, pageSize = 9 }: QuizListProps) {
  return (
    <Suspense fallback={<QuizzListItemSkeleton />}>
      <QuizList page={page} pageSize={pageSize} />
    </Suspense>
  );
}
