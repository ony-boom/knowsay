import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserCompletedChallenges } from "@/lib/actions/get-user-completed-challenges";
import { formatDate } from "@/lib/utils";
import { Challenge } from "@/schemas/challengeSchema";
import { CalendarIcon, Users } from "lucide-react";
import Link from "next/link";

const ChallengeItem = ({
  challenge,
}: {
  challenge: ChallengeWithParticipants;
}) => (
  <div className="rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{challenge.title}</h3>
      <Badge variant="outline" className="ml-2">
        {/* Rank #{challenge.rank} */}
      </Badge>
    </div>
    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1"></div>
      <CalendarIcon className="h-4 w-4" />
      <span>
        {formatDate(challenge.start_time.toString())} -{" "}
        {formatDate(challenge.end_time.toString())}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <Users className="h-4 w-4" />
      <span>{challenge.participant_count} participants</span>
    </div>
  </div>
);

export const ChallengesTab = async () => {
  const completedChallenges: ChallengeWithParticipants[] =
    await getUserCompletedChallenges();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Challenges</CardTitle>
        <CardDescription>
          Challenges you&apos;re currently participating in
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {completedChallenges?.length === 0 ? (
            <p className="text-muted-foreground text-center text-sm">
              No completed challenges yet
            </p>
          ) : (
            completedChallenges?.map((challenge) => (
              <ChallengeItem
                key={challenge.challenge_id}
                challenge={challenge}
              />
            ))
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild className="w-full">
          <Link href="/home/challenges">View All Challenges</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

type ChallengeWithParticipants = Challenge & {
  participant_count: number;
};
