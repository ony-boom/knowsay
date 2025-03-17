import { getQuiz } from "@/app/api/quizzes/[id]/route";
import { getQuestions } from "@/app/api/questions/route";
import { StartQuiz } from "./start-quiz";
import { Separator } from "@/components/ui/separator";

export default async function QuizPage(props: {
  params: Promise<{
    id: string;
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

  return (
    <div className="space-y-8">
      <hgroup className="space-y-2">
        {quiz.description && (
          <p className="text-foreground/70 max-w-[45ch]">
            {quiz.description}
          </p>
        )}
      </hgroup>

      <Separator />

      <StartQuiz questions={questions} />
    </div>
  );
}
