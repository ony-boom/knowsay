import { cn } from "@/lib/utils";
import { Medal, Trophy, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderBoardEntry } from "@/lib/definitions";
import { clerkClient } from "@clerk/nextjs/server";

export const LeaderboardItem = async ({ user }: LeaderboardItemProps) => {
  const clerkUser = await (
    await clerkClient()
  ).users.getUser(user.user_clerk_id);

  // Function to render rank icon or number
  const renderRankIndicator = () => {
    switch (user.rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-amber-500 sm:h-5 sm:w-5" />;
      case 2:
        return <Medal className="h-4 w-4 text-slate-400 sm:h-5 sm:w-5" />;
      case 3:
        return <Medal className="h-4 w-4 text-orange-500 sm:h-5 sm:w-5" />;
      default:
        return (
          <span className="text-muted-foreground text-xs font-bold sm:text-sm">
            {user.rank}
          </span>
        );
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start justify-between space-y-2 rounded-lg p-3 sm:flex-row sm:items-center sm:space-y-0 sm:p-4",
        user.rank === 1 && "border border-amber-200 bg-amber-50",
        user.rank === 2 && "border border-slate-200 bg-slate-50",
        user.rank === 3 && "border border-orange-200 bg-orange-50",
      )}
    >
      <div className="flex w-full items-center space-x-3 sm:w-auto sm:space-x-4">
        <div className="bg-primary/10 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8">
          {renderRankIndicator()}
        </div>
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage
            src={clerkUser.imageUrl}
            alt={clerkUser.fullName || clerkUser.username || "User"}
            className="rounded-full"
          />
          <AvatarFallback>
            <UserCircle className="h-8 w-8 sm:h-10 sm:w-10" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow overflow-hidden">
          <p className="max-w-full truncate text-sm font-medium sm:text-base">
            {user.user_name}
          </p>
          <div className="text-muted-foreground flex flex-wrap items-center space-x-2 text-xs sm:text-sm">
            <span>Quizzes: {user.total_quiz_score}</span>
            <span className="hidden sm:inline">•</span>
            <span>Tests: {user.total_test_score}</span>
            <span className="hidden sm:inline">•</span>
            <span>Challenges: {user.total_challenges_completed}</span>
          </div>
        </div>
      </div>
      <div className="self-end text-sm font-bold sm:self-auto sm:text-base">
        {user.total_score} pts
      </div>
    </div>
  );
};

type LeaderboardItemProps = {
  user: LeaderBoardEntry & { rank: number };
};
