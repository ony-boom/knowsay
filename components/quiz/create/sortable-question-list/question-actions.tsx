import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SortableDragHandle } from "@/components/ui/sortable";
import { Edit, GripVertical, Trash2 } from "lucide-react";
import { SortableQuestionsSchema } from "../sortable-question-list";
import { QuestionAnswersSheet } from "./question-answers-sheet";

interface QuestionActionsProps {
  question: SortableQuestionsSchema["questions"][0];
  onEdit: () => void;
  onDelete: () => void;
}

export const QuestionActions: React.FC<QuestionActionsProps> = ({
  question,
  onEdit,
  onDelete,
}) => (
  <div className="mt-2 flex shrink-0 space-x-2 self-end sm:mt-0 sm:space-x-3 sm:self-auto">
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          View Answers
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <QuestionAnswersSheet question={question} />
      </SheetContent>
    </Sheet>

    <SortableDragHandle className="hover:bg-accent hover:text-accent-foreground flex h-7 w-7 items-center justify-center rounded-full">
      <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
    </SortableDragHandle>

    <Button
      variant="ghost"
      size="icon"
      onClick={onEdit}
      className="h-7 w-7 rounded-full"
    >
      <Edit className="h-3.5 w-3.5" />
      <span className="sr-only">Edit question</span>
    </Button>

    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-full"
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span className="sr-only">Delete question</span>
    </Button>
  </div>
);
