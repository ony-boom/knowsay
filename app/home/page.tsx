import { Avatar } from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Medal, Trophy, UserCircle, Users } from "lucide-react";

export default function Home() {
  // Mock data based on the provided schemas
  const mockUsers = [
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

  const mockQuizzes = [
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

  const mockChallenges = [
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

  const mockTests = [
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container space-y-8 py-10">
      <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Quizzes</CardTitle>
            <CardDescription>You&apos;ve completed 15 quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">15</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Challenges Joined</CardTitle>
            <CardDescription>
              You&apos;re participating in 3 challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Your Rank</CardTitle>
            <CardDescription>You&apos;re in the top 10%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">#1</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Leaderboard</CardTitle>
          <CardDescription>Top performers this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div
                key={user.id}
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
                      <span className="text-muted-foreground font-bold">
                        {user.rank}
                      </span>
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
                      <span className="ml-2">
                        Challenges: {user.challenges}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="font-bold">{user.score} pts</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Complete Leaderboard
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Quizzes</CardTitle>
              <CardDescription>Your recently completed quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
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
                        <span className="text-muted-foreground text-sm">
                          {quiz.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-bold">{quiz.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Quizzes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="challenges" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
              <CardDescription>
                Challenges you&apos;re currently participating in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockChallenges.map((challenge) => (
                  <div key={challenge.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{challenge.title}</h3>
                      <Badge variant="outline" className="ml-2">
                        Rank #{challenge.rank}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {formatDate(challenge.start_date)} -{" "}
                          {formatDate(challenge.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants} participants</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Challenges
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tests</CardTitle>
              <CardDescription>
                Tests you&apos;ve recently taken
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{test.title}</p>
                      <p className="text-muted-foreground text-sm">
                        Taken on {formatDate(test.created_at)}
                      </p>
                    </div>
                    <div className="text-lg font-bold">{test.score}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Tests
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
