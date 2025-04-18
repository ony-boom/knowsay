import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getUserTestWithScore,
  type UserTestWithScore,
} from "@/lib/actions/get-user-test-with-score";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const TestItem = ({ userTest }: { userTest: UserTestWithScore }) => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div>
      <p className="font-medium">
        <Link href={`/home/test/${userTest.test_id}`}>
          {userTest.tests.title}
        </Link>
      </p>
      <p className="text-muted-foreground text-sm">
        Taken on {formatDate(userTest.tests.created_at.toString())}
      </p>
    </div>
    <div className="font-bold">
      {userTest.status === "corrected" ? `${userTest.score}%` : "Not corrected"}
    </div>
  </div>
);

export const TestsTab = async () => {
  const tests = await getUserTestWithScore();
  const hasNoTests = tests?.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tests</CardTitle>
        <CardDescription>Tests you&apos;ve recently taken</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hasNoTests ? (
            <p className="text-muted-foreground text-center text-sm">
              You haven&apos;t taken any tests yet.
            </p>
          ) : (
            tests?.map((test) => (
              <TestItem key={test.test_id} userTest={test} />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href="/home/test">View All Test</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
