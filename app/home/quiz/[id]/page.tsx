import { QuizControlButton } from "@/components/quiz/take/next-quiz-button";
import { AnswerView } from "@/components/quiz/take/answer-view";
import { getAnswers, getQuestions, getQuiz } from "@/lib/actions";
import { QuizView } from "./quiz-view";
import { useMemo } from "react";

export default async function QuizPage(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    page?: number;
  }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const quiz = await getQuiz(id);
  const currentPage = Number(searchParams?.page) || 1;
  const PAGE_SIZE = 1;

  const { questions, totalCount } = await getQuestions(
    quiz.id,
    currentPage,
    PAGE_SIZE,
  );

  const currentQuestion = questions[0];

  if (!currentQuestion) {
    return (
      <div className="flex justify-center py-8">
        <p>
          The creator of this quiz, hasn&#39;t added any questions yet.
          That&#39;s a bummer. 😔
        </p>
      </div>
    );
  }

  const content = (() => {
    try {
      return JSON.parse(currentQuestion.content);
    } catch {
      return [
        {
          type: "text",
          content: "This question has no content",
        },
      ];
    }
  })();

  const answers = await getAnswers(currentQuestion.id);

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-8">
        <hgroup className="space-y-2">
          {quiz.description && (
            <p className="text-foreground/70">{quiz.description}</p>
          )}
        </hgroup>

        {/*TODO: use content from db */}
        <QuizView
          initialContent={content}
          questionId={currentQuestion.id}
          questionType={currentQuestion.type}
        />

        <AnswerView answers={answers} questionType={currentQuestion.type} />
      </div>

      <div className="flex justify-center gap-4">
        <QuizControlButton
          size="icon"
          direction="prev"
          totalPages={totalCount}
          disabled={currentPage === 1}
          currentPage={currentPage}
        />

        <QuizControlButton
          size="icon"
          direction="next"
          totalPages={totalCount}
          currentPage={currentPage}
          disabled={currentPage === totalCount}
        />
      </div>
    </div>
  );
}
