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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("quiz");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteQuizAction(quizId);

      if (result.success) {
        toast.success(t("deleteQuiz.toastSuccess.title"), {
          description: t("deleteQuiz.toastSuccess.description"),
        });
        if (onDelete) {
          onDelete(quizId);
        }
      } else {
        toast.error(result.errors?._form?.[0] || t("deleteQuiz.toastFailed"), {
          description: t("deleteQuiz.toastFailureDescription"),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(t("deleteQuiz.toastUnexpected"), {
        description: t("deleteQuiz.toastUnexpectedDescription"),
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
              <Link
                href={`/home/quiz/${quizId}/edit`}
                aria-label={t("listItem.edit")}
              >
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
              aria-label={t("listItem.delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
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
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            {t("listItem.created")}: {createdAt}
          </span>
        </div>
      </CardContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {t("deleteQuiz.dialogTitle")}
            </DialogTitle>
            <DialogDescription>
              {t("deleteQuiz.dialogDescription", { quizTitle: title })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("deleteQuiz.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("deleteQuiz.deleting") : t("deleteQuiz.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
