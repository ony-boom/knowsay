"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { AnswerForm } from "@/components/quiz/create/answer-form";
import { AnswerList } from "@/components/quiz/create/answer-list";

export type Answer = {
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setAnswers((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        const newArray = [...items];
        const [movedItem] = newArray.splice(oldIndex, 1);
        newArray.splice(newIndex, 0, movedItem);

        return newArray;
      });
    }
  };

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
          <AnswerForm
            newAnswer={newAnswer}
            setNewAnswer={setNewAnswer}
            addAnswer={addAnswer}
          />

          <AnswerList
            answers={answers}
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onEdit={handleEdit}
            onToggleCorrect={toggleCorrect}
            onDelete={handleDelete}
          />
        </CardContent>
      </form>
    </Card>
  );
}
