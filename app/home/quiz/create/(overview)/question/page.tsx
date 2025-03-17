"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlocNote } from "@/components/quiz/create/bloc-note/bloc-note";

export default function CreateQuestionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Question</CardTitle>
        <CardDescription>
          Add a question to your quiz. Make sure to provide multiple options and
          select the correct answer.
        </CardDescription>
      </CardHeader>
      <form>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="bg-background rounded-md">
              <BlocNote />
            </div>
            <p className="text-muted-foreground text-xs">
              Use the rich text editor to format your question
            </p>
          </div>
        </CardContent>
        <CardFooter className="mt-4 flex justify-end">
          <Button type="submit">Save Question</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
