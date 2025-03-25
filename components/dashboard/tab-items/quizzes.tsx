import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quiz } from "@/schemas/quizSchema";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
        {/* <span className="text-muted-foreground text-sm">{quiz.status}</span> */}
      </div>
    </div>
    {/* <div className="text-lg font-bold">{quiz.score}%</div> */}
  </div>
);

export const QuizzesTab = () => {
  // TODO: Fetch quizzes from server action
  const quizzes: Quiz[] = [];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quizzes</CardTitle>
        <CardDescription>Your recently completed quizzes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <QuizItem key={quiz.quiz_id} quiz={quiz} />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link className="w-full" href="/home/quiz">
            View All Quizzes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
