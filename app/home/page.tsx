import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { QuizzesTab } from "@/components/dashboard/tab-items/quizzes";
import { ChallengesTab } from "@/components/dashboard/tab-items/challenges";
import { TestsTab } from "@/components/dashboard/tab-items/tests";
import ChatComponent from "@/components/messages/chat-component";

export default function Home() {
  return (
    <div className="container space-y-8">
      <ChatComponent />
      <StatsOverview />

      <Leaderboard />

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-4 flex w-full justify-around gap-4 overflow-auto">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-0">
          <QuizzesTab />
        </TabsContent>

        <TabsContent value="challenges" className="mt-0">
          <ChallengesTab />
        </TabsContent>

        <TabsContent value="tests" className="mt-0">
          <TestsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
