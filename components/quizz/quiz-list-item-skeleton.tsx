import { Skeleton } from "../ui/skeleton";

export const QuizListItemSkeleton = () => {
  return (
    <Skeleton className="h-[180px] w-full rounded-lg p-6">
      {/* Card content container */}
      <Skeleton className="flex h-full w-full flex-col justify-between border-none bg-transparent">
        {/* Title and description area */}
        <Skeleton className="flex flex-col gap-2 border-none bg-transparent">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4" />
          {/* Description skeleton - two lines */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          {/* Tags skeleton */}
          <Skeleton className="mt-2 flex gap-2 border-none bg-transparent">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </Skeleton>
        </Skeleton>

        {/* Created date skeleton */}
        <Skeleton className="flex justify-end border-none bg-transparent">
          <Skeleton className="h-3 w-28" />
        </Skeleton>
      </Skeleton>
    </Skeleton>
  );
};
