import { Pagination } from "@/components/pagination";
import { TestFilter } from "@/components/test/test-filter";
import { TestList } from "@/components/test/test-list";
import { getTests } from "@/lib/actions/get-test";
import { getCurrentUserId } from "@/lib/actions/get-user";

export default async function TestPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    onlyByUser?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentUserId = await getCurrentUserId();

  const query = searchParams?.query || "";
  const page = searchParams?.page || "1";
  const onlyByUser = Boolean(searchParams?.onlyByUser);

  const currentPage = Number(page);
  const { totalPages, tests } = await getTests(
    query,
    currentPage,
    true,
    onlyByUser ? currentUserId : null,
  );

  return (
    <div className="flex h-full flex-col gap-8">
      <TestFilter />
      <TestList tests={tests} />

      <div className="mt-auto">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
