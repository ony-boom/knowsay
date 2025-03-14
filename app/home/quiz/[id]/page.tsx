// import { getQuestions } from "@/app/api/questions/route";
import { getQuiz } from "@/app/api/quizzes/[id]/route";
// import { TakeQuizCard } from "@/components/quizz/take-quiz-card";

export default async function QuizPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;
  const quiz = await getQuiz(id);
  // TODO: paginate, show one question at a time
  // but keep score of all questions
  // const { questions } = await getQuestions(id);


  return (
    <div className="space-y-4">
      <hgroup className="space-y-2">
        {quiz.description && (
          <p className="text-foreground/80 max-w-[45ch] text-xl">
            {quiz.description}
          </p>
        )}
      </hgroup>

    </div>
  );
}
