import { StatCard } from "@/components/dashboard/stats-card";
import { getStatsOverviewData } from "@/lib/actions/get-stats-overview-data";

export const StatsOverview = async () => {
  const data = await getStatsOverviewData();
  const quizCount = data[0].count ?? 0;
  const challengeCount = data[2].count ?? 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard
        title="Total Quizzes"
        description={`You've completed ${quizCount} quizzes`}
        value={quizCount}
      />
      <StatCard
        title="Challenges Joined"
        description={`You're participating in ${challengeCount} challenges`}
        value={challengeCount}
      />
    </div>
  );
};
