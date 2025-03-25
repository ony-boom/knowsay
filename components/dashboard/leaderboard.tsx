import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardItem } from "@/components/dashboard/leaderboard-item";
import { Button } from "@/components/ui/button";

export const Leaderboard = ({ users }: { users: User[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">Leaderboard</CardTitle>
      <CardDescription>Top performers</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {users.map((user) => (
          <LeaderboardItem key={user.id} user={user} />
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        View Complete Leaderboard
      </Button>
    </CardFooter>
  </Card>
);

interface User {
  id: string;
  name: string;
  score: number;
  avatar: string;
  rank: number;
  quizzes: number;
  tests: number;
  challenges: number;
}
