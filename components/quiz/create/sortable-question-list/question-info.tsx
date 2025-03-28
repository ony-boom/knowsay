import { SortableQuizQuestionsSchema } from "../sortable-quiz-question-list";

interface QuizQuestionInfoProps {
  qcm: SortableQuizQuestionsSchema["questions"][0]["qcm"];
  index: number;
}
interface FirstContent {
  type: "text";
  text: string;
}

export const QuizQuestionInfo: React.FC<QuizQuestionInfoProps> = ({
  qcm,
  index,
}) => {
  const questionContent = JSON.parse(qcm.question);
  const firstContent = questionContent.at(0)?.content[0] as FirstContent;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
        {index + 1}
      </div>
      <h4 className="line-clamp-1 max-w-[300px] overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap">
        {firstContent?.text ?? ""}
      </h4>
    </div>
  );
};
