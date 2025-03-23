import { Card, CardContent } from "@/components/ui/card";
import { SortableQuestionsSchema } from "../sortable-question-list";
import { QuestionInfo } from "./question-info";
import { QuestionActions } from "./question-actions";

interface QuestionCardProps {
  question: SortableQuestionsSchema["questions"][0];
  index: number;
  onDelete: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  onDelete,
}) => (
  <Card className="border-l-primary overflow-hidden border-l-2 transition-all hover:shadow-sm">
    <CardContent className="p-2">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <QuestionInfo question={question} index={index} />
        <QuestionActions question={question} onDelete={onDelete} />
      </div>
    </CardContent>
  </Card>
);
