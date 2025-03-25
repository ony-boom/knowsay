import { StatCard } from "@/components/dashboard/stats-card";

export const StatsOverview = () => (
  <div className="grid gap-6 md:grid-cols-3">
    <StatCard
      title="Total Quizzes"
      description="You've completed 15 quizzes"
      value="15"
    />
    <StatCard
      title="Challenges Joined"
      description="You're participating in 3 challenges"
      value="3"
    />
    <StatCard
      title="Your Rank"
      description="You're in the top 10%"
      value="#1"
    />
  </div>
);
