import React, { Suspense } from "react";
import { getUserTests } from "@/lib/actions/get-user-test";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Loading skeleton component
const TestListSkeleton = () => (
  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array(6)
      .fill(0)
      .map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="space-y-2">
            <div className="bg-muted h-5 w-3/4 rounded-md"></div>
            <div className="bg-muted h-4 w-1/2 rounded-md"></div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted h-4 w-full rounded-md"></div>
          </CardContent>
          <CardFooter>
            <div className="bg-muted h-10 w-full rounded-md"></div>
          </CardFooter>
        </Card>
      ))}
  </div>
);

// Test list item component
const UserTestListItem = ({
  testId,
  title,
  description,
  startTime,
  endTime,
  createdAt,
}: {
  testId: string;
  title: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
  createdAt: Date;
}) => {
  const isScheduled = startTime && endTime;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description || "No description available"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isScheduled ? (
          <div className="text-muted-foreground flex items-center text-sm">
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>
              {startTime.toLocaleDateString()} - {endTime.toLocaleDateString()}
            </span>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">No schedule set</div>
        )}
        <div className="text-muted-foreground flex items-center text-sm">
          <Clock className="mr-1 h-4 w-4" />
          <span>
            Created {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/home/test/${testId}/edit`}>Manage Test</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Main page component
export default async function MyTestPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            My Tests
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Review and manage the assessments you&apos;ve created.
          </p>
        </hgroup>
        <Link
          href="/home/test/create"
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create new test
        </Link>
      </div>

      <Suspense fallback={<TestListSkeleton />}>
        <TestList query={query} page={page} />
      </Suspense>
    </div>
  );
}

// Separate component to handle data fetching inside Suspense
async function TestList({ query, page }: { query: string; page: number }) {
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
