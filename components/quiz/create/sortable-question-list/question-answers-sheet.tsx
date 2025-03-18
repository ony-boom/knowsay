import { DialogTitle } from "@/components/ui/dialog";
import { SortableQuestionsSchema } from "../sortable-question-list";
import { AnswerItem } from "./answer-item";

interface QuestionAnswersSheetProps {
  question: SortableQuestionsSchema["questions"][0];
}

export const QuestionAnswersSheet: React.FC<QuestionAnswersSheetProps> = ({
  question,
}) => (
  <div className="mt-6 space-y-2">
    <DialogTitle>{question.question}</DialogTitle>
    <div className="mt-6 grid gap-1.5">
      {question.answers.map((answer, idx) => (
        <AnswerItem key={answer.id} answer={answer} index={idx} />
      ))}
    </div>
  </div>
);
