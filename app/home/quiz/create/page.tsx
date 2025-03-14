import { CreateQuizForm } from "./components/create-quiz-form";

export default function CreateQuizPage() {
  return (
    <div className="flex flex-col gap-6 px-6 py-8">
      <hgroup className="space-y-4">
        <h1 className="text-3xl font-black lg:text-5xl">Create a New Quiz</h1>
        <p className="text-foreground/80 text-lg">
          Design your interactive quiz with custom questions and share it with
          others to test their knowledge.
        </p>
      </hgroup>
      {/* Quiz creation form will go here */}
      <CreateQuizForm />
    </div>
  );
}
