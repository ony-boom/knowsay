import { Skeleton } from "../ui/skeleton";

export const QuizListItemSkeleton = () => {
  return (
    <Skeleton className="w-full rounded-lg">
      {/* Card content container */}
      <div className="flex h-full w-full flex-col justify-between space-y-4 p-4">
        {/* Title and description area */}
        <div className="flex flex-col gap-2">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4 bg-gray-200" />
          {/* Description skeleton - two lines */}
          <Skeleton className="h-4 w-full bg-gray-100" />
          <Skeleton className="h-4 w-4/5 bg-gray-100" />
          {/* Tags skeleton */}
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-gray-200" />
            <Skeleton className="h-5 w-24 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Created date skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-3 w-28 bg-gray-100" />
        </div>
      </div>
    </Skeleton>
  );
};
