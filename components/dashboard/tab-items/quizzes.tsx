import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getQuizzesWithScoresAndStatus,
  QuizzesWithScoreAndStatus,
} from "@/lib/actions/get-quiz-with-scores-and-status";
import { getAllQuizQuestions } from "@/lib/actions/get-quiz-question";
import { getQuizAttemptById } from "@/lib/actions/get-all-quiz-attempts";

export const QuizzesTab = async () => {
  const quizzes = await getQuizzesWithScoresAndStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Quizzes</CardTitle>
        <CardDescription>
          Your recently created/completed quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quizzes.map((quiz, index) => (
            <QuizItem key={index} quiz={quiz} />
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

const QuizItem = async ({ quiz }: { quiz: QuizzesWithScoreAndStatus }) => {
  const totalQuestion = await getAllQuizQuestions(quiz.quiz_id);
  const attempt = await getQuizAttemptById(quiz.attempt_id);
  const percentage = Math.round((quiz.score / totalQuestion.length) * 100) || 0;

  return (
    <div className="group hover:border-primary bg-card flex items-center justify-between rounded-lg border p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div>
          <p className="group-hover:text-primary w-full text-base font-medium transition-colors">
            <Link href={`/home/quiz/${quiz.quiz_id}`}>{quiz.title}</Link>
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-foreground/60 text-xs font-medium">
              {quiz.status === "completed"
                ? `Completed ${attempt?.completed_at ? new Date(attempt.completed_at).toLocaleDateString() : ""}`
                : quiz.status === "in_progress"
                  ? `Started ${attempt?.started_at ? new Date(attempt.started_at).toLocaleDateString() : ""}`
                  : "Draft"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-primary text-xl font-bold">
          {percentage}
          <span className="text-muted-foreground text-sm">%</span>
        </div>
        <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full ${
              percentage >= 70
                ? "bg-green-500"
                : percentage >= 40
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
