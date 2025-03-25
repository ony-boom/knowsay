import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, UserCircle, Users } from "lucide-react";
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
import { LeaderboardItem } from "@/components/dashboard/leaderboard-item";
import Link from "next/link";
import {StatsOverview} from "@/components/dashboard/stats-overview";

// Types
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

interface Quiz {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: string;
  score: number;
}

interface Challenge {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  participants: number;
  rank: number;
}

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

const QuizItem = ({ quiz }: { quiz: Quiz }) => (
  <div className="flex items-center justify-between rounded-lg border p-4">
    <div>
      <p className="font-medium">{quiz.title}</p>
      <div className="mt-1 flex items-center gap-2">
        <Badge
          variant={
            quiz.difficulty === "EASY"
              ? "outline"
              : quiz.difficulty === "MEDIUM"
                ? "secondary"
                : "destructive"
          }
        >
          {quiz.difficulty}
        </Badge>
        <span className="text-muted-foreground text-sm">{quiz.status}</span>
      </div>
    </div>
    <div className="text-lg font-bold">{quiz.score}%</div>
  </div>
);

const ChallengeItem = ({
  challenge,
  formatDate,
}: {
  challenge: Challenge;
  formatDate: (date: string) => string;
}) => (
  <div className="rounded-lg border p-4">
    <div className="flex items-center justify-between">
      <h3 className="font-medium">{challenge.title}</h3>
      <Badge variant="outline" className="ml-2">
        Rank #{challenge.rank}
      </Badge>
    </div>
    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1"></div>
      <CalendarIcon className="h-4 w-4" />
      <span>
        {formatDate(challenge.start_date)} - {formatDate(challenge.end_date)}
      </span>
    </div>
    <div className="flex items-center gap-1">
      <Users className="h-4 w-4" />
      <span>{challenge.participants} participants</span>
    </div>
  </div>
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

// Tab content components
const QuizzesTab = ({ quizzes }: { quizzes: Quiz[] }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Quizzes</CardTitle>
      <CardDescription>Your recently completed quizzes</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <QuizItem key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button asChild variant="outline" className="w-full">
        <Link className="w-fulll" href="/home/quiz">View All Quizzes</Link>
      </Button>
    </CardFooter>
  </Card>
);

const ChallengesTab = ({
  challenges,
  formatDate,
}: {
  challenges: Challenge[];
  formatDate: (date: string) => string;
}) => (
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
          <ChallengeItem
            key={challenge.id}
            challenge={challenge}
            formatDate={formatDate}
          />
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

const Leaderboard = ({ users }: { users: User[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-2xl">Leaderboard</CardTitle>
      <CardDescription>Top performers this month</CardDescription>
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

export default function Home() {
  // Mock data based on the provided schemas
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Alex Johnson",
      score: 1250,
      avatar: "/avatars/01.png",
      rank: 1,
      quizzes: 15,
      tests: 8,
      challenges: 3,
    },
    {
      id: "2",
      name: "Sara Williams",
      score: 980,
      avatar: "/avatars/02.png",
      rank: 2,
      quizzes: 12,
      tests: 7,
      challenges: 2,
    },
    {
      id: "3",
      name: "Marcus Lee",
      score: 875,
      avatar: "/avatars/03.png",
      rank: 3,
      quizzes: 10,
      tests: 5,
      challenges: 1,
    },
    {
      id: "4",
      name: "Emma Garcia",
      score: 760,
      avatar: "/avatars/04.png",
      rank: 4,
      quizzes: 8,
      tests: 4,
      challenges: 1,
    },
    {
      id: "5",
      name: "Daniel Kim",
      score: 620,
      avatar: "/avatars/05.png",
      rank: 5,
      quizzes: 7,
      tests: 3,
      challenges: 0,
    },
  ];

  const mockQuizzes: Quiz[] = [
    {
      id: "q1",
      title: "JavaScript Fundamentals",
      difficulty: "EASY",
      status: "published",
      score: 95,
    },
    {
      id: "q2",
      title: "React Hooks Deep Dive",
      difficulty: "HARD",
      status: "published",
      score: 87,
    },
    {
      id: "q3",
      title: "CSS Grid and Flexbox",
      difficulty: "MEDIUM",
      status: "published",
      score: 90,
    },
  ];

  const mockChallenges: Challenge[] = [
    {
      id: "c1",
      title: "30 Days of Coding",
      start_date: "2023-05-01T00:00:00Z",
      end_date: "2023-05-30T23:59:59Z",
      participants: 153,
      rank: 7,
    },
    {
      id: "c2",
      title: "Web Development Bootcamp",
      start_date: "2023-06-15T00:00:00Z",
      end_date: "2023-07-15T23:59:59Z",
      participants: 89,
      rank: 2,
    },
  ];

  const mockTests: Test[] = [
    {
      id: "t1",
      title: "Front-end Skills Assessment",
      created_at: "2023-04-10T14:30:00Z",
      score: 92,
    },
    {
      id: "t2",
      title: "React Performance Testing",
      created_at: "2023-05-22T09:15:00Z",
      score: 85,
    },
    {
      id: "t3",
      title: "Algorithm Challenge",
      created_at: "2023-06-05T16:45:00Z",
      score: 78,
    },
  ];

  const mockAssignedTests: AssignedTest[] = [
    {
      id: "at1",
      title: "JavaScript Advanced Concepts",
      student: "Ryan Garcia",
      submitted_at: "2023-07-12T10:30:00Z",
      status: "pending",
      deadline: "2023-07-15T23:59:59Z",
    },
    {
      id: "at2",
      title: "React Component Patterns",
      student: "Emily Chen",
      submitted_at: "2023-07-10T14:15:00Z",
      status: "in_progress",
      deadline: "2023-07-14T23:59:59Z",
    },
    {
      id: "at3",
      title: "TypeScript Fundamentals",
      student: "Michael Brown",
      submitted_at: "2023-07-08T09:45:00Z",
      status: "pending",
      deadline: "2023-07-13T23:59:59Z",
    },
    {
      id: "at4",
      title: "CSS Animation Techniques",
      student: "Sophie Williams",
      submitted_at: "2023-07-05T16:20:00Z",
      status: "completed",
      deadline: "2023-07-12T23:59:59Z",
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container space-y-8">
      <StatsOverview />

      <Leaderboard users={mockUsers} />

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-4 grid grid-cols-4">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-0">
          <QuizzesTab quizzes={mockQuizzes} />
        </TabsContent>

        <TabsContent value="challenges" className="mt-0">
          <ChallengesTab challenges={mockChallenges} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="tests" className="mt-0">
          <TestsTab tests={mockTests} formatDate={formatDate} />
        </TabsContent>

        <TabsContent value="assigned" className="mt-0">
          <AssignedTestsTab
            assignments={mockAssignedTests}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
