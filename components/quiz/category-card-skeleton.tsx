import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const CategoryCardSkeleton = () => {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              <div className="flex h-8 w-full items-center justify-between rounded-md px-2 py-1">
                <Skeleton className="h-4 w-24 bg-gray-200" />
                <Skeleton className="h-5 w-6 rounded-full bg-gray-200" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
