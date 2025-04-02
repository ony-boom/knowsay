import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function TestListSkeleton() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <TestListItemSkeleton key={index} />
      ))}
    </div>
  );
}

const TestListItemSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          <Skeleton className="h-6 w-3/4" />
        </CardTitle>
        <CardDescription className="line-clamp-2">
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardDescription>

        <CardContent className="mt-4 flex justify-between p-0">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </CardContent>
      </CardHeader>
    </Card>
  );
};
