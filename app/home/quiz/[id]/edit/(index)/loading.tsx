import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8 pt-0">
      <hgroup className="space-y-4">
        <Skeleton className="h-12 w-3/4 md:h-14 lg:h-16" />
        <Skeleton className="h-6 w-full" />
      </hgroup>

      {/* Quiz form skeleton */}
      <div className="w-full rounded-lg border">
        <div className="flex w-full items-center justify-between p-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
        <div className="border-t p-4 pt-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
