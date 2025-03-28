"use client";

import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { SortableQuizQuestionsSchema } from "../sortable-quiz-question-list";
import { QuestionAnswersSheet } from "./question-answers-sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { DeleteQuestionDialog } from "./delete-question-dialog";
import { useState } from "react";

interface QuizQuestionActionsProps {
  question: SortableQuizQuestionsSchema["questions"][0];
}

export const QuizQuestionActions: React.FC<QuizQuestionActionsProps> = ({
  question,
}) => {
  const { id: quizId } = useParams();
  const pathname = usePathname();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <div className="mt-2 flex shrink-0 space-x-2 self-end sm:mt-0 sm:space-x-3 sm:self-auto">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            View Answers
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <QuestionAnswersSheet question={question} />
        </DialogContent>
      </Dialog>

      <Link
        href={`${pathname}/question/${question.id}/edit`}
        className="ring-offset-background hover:bg-muted focus-visible:ring-ring inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
      >
        <Edit className="h-3.5 w-3.5" />
        <span className="sr-only">Edit question</span>
      </Link>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete question</span>
          </Button>
        </DialogTrigger>
        <DeleteQuestionDialog
          id={question.id}
          quizId={quizId as string}
          onClose={() => {
            setOpenDeleteDialog(false);
          }}
        />
      </Dialog>
    </div>
  );
};
