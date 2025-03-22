import { DialogTitle } from "@/components/ui/dialog";
import { SortableQuestionsSchema } from "../sortable-question-list";

interface QuestionAnswersSheetProps {
  question: SortableQuestionsSchema["questions"][number];
}

export const QuestionAnswersSheet: React.FC<QuestionAnswersSheetProps> = ({
  question,
}) => (
  <div className="mt-6 space-y-2">
    <DialogTitle>{question.content}</DialogTitle>
    <div className="mt-6 grid gap-1.5">
    </div>
  </div>
);
