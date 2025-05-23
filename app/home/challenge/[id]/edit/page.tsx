import { QuizManager } from "@/components/challenge/quiz-manager";
import { UpdateChallengeForm } from "@/components/quiz/edit/update-challenge-form";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getChallengeById } from "@/lib/actions/get-challenge";
import { getChallengeQuizWithQuiz } from "@/lib/actions/get-challenge-quiz";
import { ChallengeQuizWithQuizArray } from "@/schemas/challengeQuizSchema";
import { ChevronsUpDown, Users } from "lucide-react";
import Link from "next/link";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const challenge = await getChallengeById(id);

  const challengeQuiz: ChallengeQuizWithQuizArray =
    await getChallengeQuizWithQuiz(id);

  if (!challenge) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6">
        <div className="bg-muted rounded-lg p-8 text-center shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Challenge Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The challenge you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <a
            href="/home/challenge"
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            Back to Challenges
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 pt-0 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2 md:space-y-4">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            Edit Challenge
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Update your challenge details to refine the experience for
            participants.
          </p>
        </hgroup>

        <Link
          href={`/home/challenge/${id}/edit/manage-participants`}
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
        >
          <Users className="h-4 w-4" />
          Manage Participants
        </Link>
      </div>

      {/* edit quiz form */}
      <Collapsible className="w-full rounded-lg border" defaultOpen>
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Challenge Information</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <UpdateChallengeForm initialData={challenge} />
        </CollapsibleContent>
      </Collapsible>

      {/* quiz manager */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Quiz Manager</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <p className="text-foreground/80 mt-4 mb-4 text-lg">
            Manage your quizzes and track your progress seamlessly.
          </p>
          <QuizManager initialQuizzes={challengeQuiz} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
