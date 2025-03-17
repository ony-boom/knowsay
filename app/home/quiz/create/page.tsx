"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CreateQuizForm } from "./components/create-quiz-form";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { QuestionsManager } from "./components/question-manager";

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

      {/* create quiz form */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Describe Your Amazing Quiz Here</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <CreateQuizForm />
        </CollapsibleContent>
      </Collapsible>

      {/* create questions */}
      <Collapsible className="w-full rounded-lg border">
        <CollapsibleTrigger asChild>
          <div className="flex w-full items-center justify-between p-4 font-medium">
            <span>Create Questions</span>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="border-t p-4 pt-0">
          <p className="text-foreground/80 mt-4 text-lg">
            Create questions for your quiz. You can add multiple questions and
            customize them as needed.
          </p>
          <QuestionsManager />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
