import { Card, CardContent } from "@/components/ui/card";
import { SortableQuizQuestionsSchema } from "../sortable-quiz-question-list";
import { QuizQuestionInfo } from "./question-info";
import { QuizQuestionActions } from "./question-actions";

interface QuizQuestionCardProps {
  question: SortableQuizQuestionsSchema["questions"][0];
  index: number;
}

export const QuizQuestionCard: React.FC<QuizQuestionCardProps> = ({
  question,
  index,
}) => (
  <Card className="border-l-primary overflow-hidden border-l-2 transition-all hover:shadow-sm">
    <CardContent className="p-2">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <QuizQuestionInfo qcm={question["qcm"]} index={index} />
        <QuizQuestionActions question={question} />
      </div>
    </CardContent>
  </Card>
);
