import { getQuestions, getQuizById } from "@/lib/actions";
import { Separator } from "@/components/ui/separator";
import { QuizViewContainer } from "../quiz-view/quiz-view-container";

export default async function QuizPage(props: {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    page?: number;
  }>;
}) {
  const { id } = await props.params;
  const quiz = await getQuizById(id);

  const { questions } = await getQuestions(
    quiz?.id || "0",
    undefined,
    undefined,
    false,
  );

  if (questions.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p>
          The creator of this quiz, hasn&#39;t added any questions yet.
          That&#39;s a bummer. 😔
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <hgroup className="space-y-2">
        {quiz?.description && (
          <p className="text-foreground/70 leading-relaxed text-balance">
            {quiz.description}
          </p>
        )}
      </hgroup>

      <Separator />

      <QuizViewContainer questions={questions} />
    </div>
  );
}
