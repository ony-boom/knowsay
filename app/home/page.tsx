import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle } from "lucide-react";
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
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { QuizzesTab } from "@/components/dashboard/tab-items/quizzes";
import { ChallengesTab } from "@/components/dashboard/tab-items/challenges";

interface Test {
  id: string;
  title: string;
  created_at: string;
  score: number;
}

interface AssignedTest {
  id: string;
  title: string;
  student: string;
  submitted_at: string;
  status: "pending" | "in_progress" | "completed";
  deadline: string;
}

const AssignedTestItem = ({
  assignment,
  formatDate,
}: {
  assignment: AssignedTest;
  formatDate: (date: string) => string;
}) => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div>
      <p className="font-medium">{assignment.title}</p>
      <div className="mt-1 flex items-center gap-2">
        <UserCircle className="text-muted-foreground h-4 w-4" />
        <span className="text-muted-foreground text-sm">
          {assignment.student}
        </span>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Submitted on {formatDate(assignment.submitted_at)}
      </p>
    </div>
    <div className="flex flex-col items-end gap-2">
      <Badge
        className={
          assignment.status === "completed"
            ? "bg-green-100 text-green-800 hover:bg-green-200"
            : assignment.status === "in_progress"
              ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
              : ""
        }
      >
        {assignment.status === "pending"
          ? "Pending"
          : assignment.status === "in_progress"
            ? "In Progress"
            : "Completed"}
      </Badge>
      <p className="text-muted-foreground text-xs">
        Due: {formatDate(assignment.deadline)}
      </p>
    </div>
  </div>
);

const TestsTab = ({
  tests,
  formatDate,
}: {
  tests: Test[];
  formatDate: (date: string) => string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Tests</CardTitle>
      <CardDescription>Tests you&apos;ve recently taken</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {tests.map((test) => (
          <TestItem key={test.id} test={test} formatDate={formatDate} />
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        View All Tests
      </Button>
    </CardFooter>
  </Card>
);

const AssignedTestsTab = ({
  assignments,
  formatDate,
}: {
  assignments: AssignedTest[];
  formatDate: (date: string) => string;
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Assigned Tests</CardTitle>
      <CardDescription>Tests assigned to you for correction</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <AssignedTestItem
            key={assignment.id}
            assignment={assignment}
            formatDate={formatDate}
          />
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        View All Assigned Tests
      </Button>
    </CardFooter>
  </Card>
);

const TestItem = ({
  test,
  formatDate,
}: {
  test: Test;
  formatDate: (date: string) => string;
}) => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div>
      <p className="font-medium">{test.title}</p>
      <p className="text-muted-foreground text-sm">
        Taken on {formatDate(test.created_at)}
      </p>
    </div>
    <div className="text-lg font-bold">{test.score}%</div>
  </div>
);

export default function Home() {
  return (
    <div className="container space-y-8">
      <StatsOverview />

      <Leaderboard />

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-4 flex w-full justify-around gap-4 overflow-auto">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-0">
          <QuizzesTab />
        </TabsContent>

        <TabsContent value="challenges" className="mt-0">
          <ChallengesTab />
        </TabsContent>

        <TabsContent value="tests" className="mt-0">
          {/* <TestsTab tests={mockTests} formatDate={formatDate} /> */}
        </TabsContent>

        <TabsContent value="assigned" className="mt-0">
          {/* <AssignedTestsTab
            assignments={mockAssignedTests}
            formatDate={formatDate}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
