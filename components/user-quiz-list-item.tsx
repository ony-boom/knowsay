"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteQuizAction } from "@/lib/actions/delete-quiz";
import { toast } from "sonner";

type QuizListItemProps = {
  quizId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  createdAt: string;
  onDelete?: (quizId: string) => void;
};

export const UserQuizListItem = ({
  quizId,
  title,
  description,
  category,
  difficulty,
  createdAt,
  onDelete,
}: QuizListItemProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteQuizAction(quizId);

      if (result.success) {
        toast.success("Quiz deleted successfully", {
          description: "Your quiz has been permanently removed",
        });
        if (onDelete) {
          onDelete(quizId);
        }
      } else {
        toast.error(result.errors?._form?.[0] || "Failed to delete quiz", {
          description: "Please try again later",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <Card className="group w-full transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={`/home/quiz/${quizId}/edit`} aria-label="Edit quiz">
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              aria-label="Delete quiz"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
        {/* Quiz metadata tags */}
        <div className="mt-2 flex gap-2">
          <span className="bg-secondary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            {difficulty}
          </span>
          <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-ellipsis whitespace-nowrap">
            {category}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Creation date information */}
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Created: {createdAt}</span>
        </div>
      </CardContent>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{title}&quot;? This action
              cannot be undone and all associated questions and data will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Quiz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
