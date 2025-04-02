import React, { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { UserTestList } from "@/components/user-test-list";

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
        <UserTestList query={query} page={page} />
      </Suspense>
    </div>
  );
}
