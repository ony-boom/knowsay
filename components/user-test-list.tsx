import { getUserTests } from "@/lib/actions/get-user-test";
import { Button } from "./ui/button";
import Link from "next/link";
import { UserTestListItem } from "./user-test-list-item";
import { getTranslations } from "next-intl/server";

// Separate component to handle data fetching inside Suspense
export async function UserTestList({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const { tests } = await getUserTests(query, page);
  const t = await getTranslations("home.myTest");

  if (tests.length === 0) {
    return (
      <div className="grid h-full place-items-center py-16">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t("empty")}</p>
          <Button asChild>
            <Link href="/home/test/create">{t("createTestButton")}</Link>
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
