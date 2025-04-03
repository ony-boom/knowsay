import { Pagination } from "@/components/pagination";
import { TestFilter } from "@/components/test/test-filter";
import { TestListSkeleton } from "@/components/test/test-list-skeleton";

export default function Loading() {
  return (
    <div className="pointer-events-none flex h-full flex-col gap-8">
      <TestFilter />
      <TestListSkeleton />

      <div className="mt-auto">
        <Pagination totalPages={0} />
      </div>
    </div>
  );
}
