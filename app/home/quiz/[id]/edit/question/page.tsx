"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DynamicQuestionEditor } from "@/components/quiz/create/bloc-note/dynamic-editor";
import { Block } from "@blocknote/core";

export default function CreateQuestionPage() {
  const handleChange = (value: Block[]) => {
    // Handle the change event here
    console.log("Question content changed:", value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Create New Question</CardTitle>
          <CardDescription>
            Add a question to your quiz. Make sure to provide multiple options
            and select the correct answer.
          </CardDescription>
        </div>
        <Button type="submit" form="question-form">
          Save Question
        </Button>
      </CardHeader>
      <form id="question-form">
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-background rounded-md">
              <DynamicQuestionEditor onChange={handleChange} />
            </div>
            <p className="text-muted-foreground text-xs">
              Use the rich text editor to format your question
            </p>
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
