"use client";

import { useState } from "react";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { PlusCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createChallengeQuizzesAction } from "@/lib/actions/create-challenge-quiz";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { toast } from "sonner";

type QuizListForChallengeItemProps = {
  quizId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
};

export const QuizListForChallengeItem = ({
  quizId,
  title,
  description,
  category,
  difficulty,
  createdAt,
  challengeId,
}: QuizListForChallengeItemProps & {
  challengeId?: string;
  position?: number;
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isPending, startTransition] = useTransition();

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
          setIsAdded(true);
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

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex flex-col space-y-2">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <CardDescription className="line-clamp-2 min-h-[2.5rem]">
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
        {/* Creation date information with button */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            Created: {createdAt}
          </span>
          <Button
            onClick={handleAddToChallenge}
            disabled={isPending || isAdded || !challengeId}
            variant={isAdded ? "outline" : "default"}
            size="sm"
            className={cn(
              "transition-all",
              isAdded && "border-green-500 text-green-500",
            )}
          >
            {isPending ? (
              "Adding..."
            ) : isAdded ? (
              <>
                <CheckCircle className="mr-1 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <PlusCircle className="mr-1 h-4 w-4" />
                Add to Challenge
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
