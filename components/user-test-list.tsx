import { getUserTests } from "@/lib/actions/get-user-test";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserTestListItem } from "./user-test-list-item";

// Separate component to handle data fetching inside Suspense
export async function UserTestList({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const { tests } = await getUserTests(query, page);

  if (tests.length === 0) {
    return (
      <div className="grid h-full place-items-center py-16">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created any tests yet.
          </p>
          <Button asChild>
            <Link href="/home/test/create">Create test</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tests.map((test) => (
        <UserTestListItem
          key={test.test_id}
          testId={test.test_id}
          title={test.title}
          description={test.description || ""}
          startTime={test.start_time}
          endTime={test.end_time}
          createdAt={test.created_at}
        />
      ))}
    </div>
  );
}
