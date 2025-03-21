import { getQuestions, getQuiz } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import { QuizViewContainer } from "./quiz-view/quiz-view-container";

export default async function QuizPage(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    page?: number;
  }>;
}) {
  const { id } = await props.params;
  const quiz = await getQuiz(id);

  const { questions } = await getQuestions(
    quiz.id,
    undefined,
    undefined,
    false,
  );

  if (questions.length === 0) {
    return (
      <div className="flex justify-center">
        <p>
          The creator of this quiz, hasn&#39;t added any questions yet.
          That&#39;s a bummer. 😔
        </p>
      </div>
    );
  }

  return (
    <>
      <hgroup className="space-y-2">
        <h2 className="text-2xl font-bold">{quiz.title}</h2>
        {quiz.description && (
          <p className="text-foreground/70 text-sm leading-relaxed text-balance">
            {quiz.description}
          </p>
        )}
      </hgroup>

      <QuizViewContainer questions={questions} />
    </>
  );
}
