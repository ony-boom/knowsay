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
import { formatDate } from "@/lib/utils";
import { Challenge } from "@/schemas/challengeSchema";
import { CalendarIcon } from "lucide-react";

const ChallengeItem = ({ challenge }: { challenge: Challenge }) => (
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
        {formatDate(challenge.start_time)} - {formatDate(challenge.end_time)}
      </span>
    </div>
    <div className="flex items-center gap-1">
      {/* <Users className="h-4 w-4" />
      <span>{challenge.participants} participants</span> */}
    </div>
  </div>
);

export const ChallengesTab = () => {
  const challenges: Challenge[] = [];
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
          {challenges.map((challenge) => (
            <ChallengeItem key={challenge.challenge_id} challenge={challenge} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Challenges
        </Button>
      </CardFooter>
    </Card>
  );
};
