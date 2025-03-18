"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export default function CreateAnswerPage() {
  const [answers, setAnswers] = useState<Answer[]>([
    { id: uuidv4(), text: "Answer option 1", isCorrect: true },
    { id: uuidv4(), text: "Answer option 2", isCorrect: false },
  ]);

  const [newAnswer, setNewAnswer] = useState("");

  const addAnswer = () => {
    if (newAnswer.trim()) {
      setAnswers([
        ...answers,
        { id: uuidv4(), text: newAnswer, isCorrect: false },
      ]);
      setNewAnswer("");
    }
  };

  const handleDelete = (id: string) => {
    setAnswers(answers.filter((answer) => answer.id !== id));
  };

  const handleEdit = (updatedAnswer: Answer) => {
    setAnswers(
      answers.map((answer) =>
        answer.id === updatedAnswer.id ? updatedAnswer : answer,
      ),
    );
  };

  const toggleCorrect = (id: string) => {
    setAnswers(
      answers.map((answer) =>
        answer.id === id ? { ...answer, isCorrect: !answer.isCorrect } : answer,
      ),
    );
  };

  const formattedAnswers = answers.map((answer) => ({
    ...answer,
    question: answer.text,
    type: "QCM" as const,
    answers: [],
  }));

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Manage Answer Options</CardTitle>
          <CardDescription>
            Create and organize answer options for your question. Mark the
            correct answers.
          </CardDescription>
        </div>
        <Button type="submit" form="answer-form">
          Save Answers
        </Button>
      </CardHeader>
      <form id="answer-form">
        <CardContent className="space-y-6">
          {/* Add answer form on top */}
          <div className="space-y-4 border-b pb-4">
            <div className="grid gap-2">
              <Label htmlFor="new-answer">New Answer Option</Label>
              <div className="flex gap-2">
                <Input
                  id="new-answer"
                  placeholder="Enter an answer option"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                />
                <Button type="button" onClick={addAnswer}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              After adding, you can mark answers as correct from the list below.
            </p>
          </div>

          {/* Answer list */}
          <div className="space-y-4">
            <h3 className="font-medium">Answer Options</h3>
            {answers.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">No answers yet</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Add some answers to get started
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {answers.map((answer, index) => (
                  <Card
                    key={answer.id}
                    className="border-l-4 transition-all hover:shadow-md"
                    style={{
                      borderLeftColor: answer.isCorrect
                        ? "var(--primary)"
                        : "transparent",
                    }}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex flex-1 items-center gap-3">
                        <span className="text-muted-foreground font-medium">
                          {index + 1}.
                        </span>
                        <Input
                          value={answer.text}
                          onChange={(e) =>
                            handleEdit({ ...answer, text: e.target.value })
                          }
                          className="border-none p-0 shadow-none focus-visible:ring-0"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`correct-${answer.id}`}
                            checked={answer.isCorrect}
                            onCheckedChange={() => toggleCorrect(answer.id)}
                          />
                          <Label
                            htmlFor={`correct-${answer.id}`}
                            className="text-sm"
                          >
                            Correct
                          </Label>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(answer.id)}
                        >
                          <Trash2 className="text-muted-foreground h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </form>
    </Card>
  );
}
