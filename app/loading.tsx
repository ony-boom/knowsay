import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-full max-w-[400px]" />
      </div>
    </div>
  );
}
