import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LeaderboardItem } from "@/components/dashboard/leaderboard-item";
import { getLeaderboard } from "@/lib/actions/get-leaderboard";

export const Leaderboard = async () => {
  const data = await getLeaderboard();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Leaderboard</CardTitle>
        <CardDescription>
          Current standings of the top users in the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <LeaderboardItem
              key={item.user_id}
              user={{
                ...item,
                rank: index + 1,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
