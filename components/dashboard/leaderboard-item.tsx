import { Medal, Trophy, UserCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export const LeaderboardItem = ({ user }: { user: User }) => (
  <div
    className={`flex items-center justify-between rounded-lg p-4 ${
      user.rank === 1
        ? "border border-amber-200 bg-amber-50"
        : user.rank === 2
          ? "border border-slate-200 bg-slate-50"
          : user.rank === 3
            ? "border border-orange-200 bg-orange-50"
            : ""
    }`}
  >
    <div className="flex items-center space-x-4">
      <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
        {user.rank === 1 ? (
          <Trophy className="h-5 w-5 text-amber-500" />
        ) : user.rank === 2 ? (
          <Medal className="h-5 w-5 text-slate-400" />
        ) : user.rank === 3 ? (
          <Medal className="h-5 w-5 text-orange-500" />
        ) : (
          <span className="text-muted-foreground font-bold">{user.rank}</span>
        )}
      </div>
      <Avatar className="h-10 w-10">
        <UserCircle className="h-10 w-10" />
      </Avatar>
      <div>
        <p className="font-medium">{user.name}</p>
        <div className="text-muted-foreground flex items-center text-sm">
          <span className="mr-2">Quizzes: {user.quizzes}</span>•
          <span className="mx-2">Tests: {user.tests}</span>•
          <span className="ml-2">Challenges: {user.challenges}</span>
        </div>
      </div>
    </div>
    <div className="font-bold">{user.score} pts</div>
  </div>
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
