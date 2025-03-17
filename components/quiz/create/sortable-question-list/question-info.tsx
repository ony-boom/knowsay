import { SortableQuestionsSchema } from "../sortable-question-list";

interface QuestionInfoProps {
  question: SortableQuestionsSchema["questions"][0];
  index: number;
}

export const QuestionInfo: React.FC<QuestionInfoProps> = ({
  question,
  index,
}) => (
  <div className="flex min-w-0 flex-1 items-center gap-2">
    <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
      {index + 1}
    </div>
    <h4 className="line-clamp-1 text-sm font-medium">{question.question}</h4>
    <div className="text-muted-foreground ml-1 shrink-0 text-xs">
      {question.type}
    </div>
  </div>
);
