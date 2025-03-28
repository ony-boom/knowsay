import React, { Suspense } from "react";
import { getUserChallenges } from "@/lib/actions/get-user-challenges";
import Link from "next/link";
import { Plus } from "lucide-react";
import { UserChallengeListSkeleton } from "@/components/user-challenge-list-skeleton";
import { UserChallengeListItem } from "@/components/user-challenge-list-item";

export default async function MyChallengePage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    category?: string;
  }>;
}) {
  const params = await props.searchParams;
  const query = params?.query || "";

  const { challenges } = await getUserChallenges(query);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            My Challenges
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Review and manage the challenges you&apos;ve created.
          </p>
        </hgroup>
        <Link
          href="/home/challenge/create"
          className="bg-primary text-primary-foreground ring-offset-background hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your own challenge
        </Link>
      </div>

      <Suspense fallback={<UserChallengeListSkeleton />}>
        {challenges.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => (
              <UserChallengeListItem
                key={challenge.challenge_id}
                challenge={challenge}
              />
            ))}
          </div>
        ) : (
          <div className="grid h-full place-items-center py-8">
            <p className="text-muted-foreground">
              You haven&apos;t created any challenges yet. Start building your
              challenge collection now!
            </p>
          </div>
        )}
      </Suspense>
    </div>
  );
}
