import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";

export const UserChallengeListItemSkeleton = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          {/* Title skeleton */}
          <Skeleton className="h-6 w-3/4" />
          {/* Action buttons skeleton */}
          <div className="flex space-x-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
        {/* Description skeleton - two lines */}
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />

        {/* Challenge metadata tags skeleton */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Challenge stats and dates skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="mt-2 h-3 w-28" />
        </div>
      </CardContent>
    </Card>
  );
};
