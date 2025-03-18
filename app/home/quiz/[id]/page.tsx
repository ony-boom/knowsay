import { getQuiz } from "@/app/api/quizzes/[id]/route";
import { getQuestions } from "@/app/api/questions/route";
import { QuizView } from "./quiz-view";
import { mockData } from "@/app/home/quiz/[id]/mock-data";
import { NextQuizButton } from "./components/next-quiz-button";

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

  // TODO: use questions which should be an array of json
  const { questions, totalCount } = await getQuestions(
    quiz.id,
    searchParams?.page,
  );

  return (
    <div className="space-y-8">
      <hgroup className="space-y-2">
        {quiz.description && (
          <p className="text-foreground/70 max-w-[45ch]">{quiz.description}</p>
        )}
      </hgroup>

      <QuizView initialContent={mockData} />

      <div className="flex justify-end">
        <NextQuizButton
          size="icon"
          totalPages={totalCount}
          currentPage={Number(searchParams?.page ?? 1)}
        />
      </div>
    </div>
  );
}
