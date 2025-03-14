import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 space-y-6 md:w-64">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-80 w-full" />
      </aside>
      <main className="flex-1">
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="mt-8">
          <Skeleton className="mx-auto h-10 w-full max-w-[400px]" />
        </div>
      </main>
    </div>
  );
}
