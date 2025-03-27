"use client";

import { useTransition } from "react";
import { Button } from "../ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { createChallengeQuizzesAction } from "@/lib/actions/create-challenge-quiz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "sonner";
import { ChallengeQuizWithQuizArray } from "@/schemas/challengeQuizSchema";
import { deleteChallengeQuizAction } from "@/lib/actions/delete-challenge-quiz";

type QuizListForChallengeItemProps = {
  quizId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  challengeQuiz: ChallengeQuizWithQuizArray;
};

export const QuizListForChallengeItem = ({
  quizId,
  title,
  description,
  category,
  difficulty,
  challengeId,
  challengeQuiz,
}: QuizListForChallengeItemProps & {
  challengeId?: string;
  position?: number;
}) => {
  const [isPending, startTransition] = useTransition();

  // Check if this quiz is already in the challenge
  const existingChallengeQuiz = challengeQuiz?.find(
    (item) => item.quiz_id === quizId,
  );
  const isAlreadyInChallenge = !!existingChallengeQuiz;

  const handleAddToChallenge = () => {
    if (!challengeId) {
      toast.error("Error", {
        description: "Challenge ID is required",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await createChallengeQuizzesAction(challengeId, [
          {
            quiz_id: quizId,
          },
        ]);

        if (result.success) {
          toast.success("Quiz added to challenge successfully", {
            description: "The quiz has been added to your challenge",
          });
        } else {
          toast.error("Error", {
            description:
              result.errors?._form?.[0] || "Failed to add quiz to challenge",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    });
  };

  const handleRemoveFromChallenge = () => {
    if (!existingChallengeQuiz) {
      toast.error("Error", {
        description: "Quiz is not part of this challenge",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteChallengeQuizAction(
          existingChallengeQuiz.id,
        );

        if (result.success) {
          toast.success("Quiz removed from challenge", {
            description: "The quiz has been removed from your challenge",
          });
        } else {
          toast.error("Error", {
            description:
              result.errors?._form?.[0] ||
              "Failed to remove quiz from challenge",
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      }
    });
  };

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {description}
          </CardDescription>

          {/* Quiz metadata tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="bg-secondary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {difficulty}
            </span>
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
              {category}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Button for adding/removing from challenge */}
        <div className="flex justify-end">
          {isAlreadyInChallenge ? (
            <Button
              onClick={handleRemoveFromChallenge}
              disabled={isPending || !challengeId}
              variant="outline"
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              {isPending ? (
                "Removing..."
              ) : (
                <>
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Remove from Challenge
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleAddToChallenge}
              disabled={isPending || !challengeId}
              variant="default"
              size="sm"
            >
              {isPending ? (
                "Adding..."
              ) : (
                <>
                  <PlusCircle className="mr-1 h-4 w-4" />
                  Add to Challenge
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
