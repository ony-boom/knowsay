import { QuizListItemSkeleton } from "./quiz-list-item-skeleton";

export const QuizListSkeleton = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <QuizListItemSkeleton key={index} />
      ))}
    </div>
  );
};
