"use client";

import { useState } from "react";
import { Question } from "../../../app/home/quiz/create/types";
import { SortableQuestionList } from "./sortable-question-list";
import { AddQuestionButton } from "./add-question-button";
import { usePathname } from "next/navigation";

export function QuestionsManager() {
  const pathname = usePathname();

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      question: "What is the capital of France?",
      answers: [
        { id: "a1", text: "Paris", isCorrect: true },
        { id: "a2", text: "London", isCorrect: false },
        { id: "a3", text: "Berlin", isCorrect: false },
      ],
    },
    {
      id: "q2",
      question: "Which planet is known as the Red Planet?",
      answers: [
        { id: "a4", text: "Mars", isCorrect: true },
        { id: "a5", text: "Venus", isCorrect: false },
        { id: "a6", text: "Jupiter", isCorrect: false },
      ],
    },
    {
      id: "q3",
      question: "Who wrote 'Romeo and Juliet'?",
      answers: [
        { id: "a7", text: "William Shakespeare", isCorrect: true },
        { id: "a8", text: "Charles Dickens", isCorrect: false },
        { id: "a9", text: "Jane Austen", isCorrect: false },
      ],
    },
    {
      id: "q4",
      question: "What is the largest ocean on Earth?",
      answers: [
        { id: "a10", text: "Pacific Ocean", isCorrect: true },
        { id: "a11", text: "Atlantic Ocean", isCorrect: false },
        { id: "a12", text: "Indian Ocean", isCorrect: false },
      ],
    },
  ]);

  const [, setCurrentQuestion] = useState<Question | null>(null);
  const [, setIsEditing] = useState(false);

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion({ ...question });
    setIsEditing(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Quiz Questions</h3>

        <AddQuestionButton pathname={pathname} />
      </div>

      <div className="mt-8">
        <SortableQuestionList
          initialQuestions={questions.map((q) => ({ ...q, type: "QCM" }))}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          onReorder={(reorderedQuestions) => {
            setQuestions(reorderedQuestions);
          }}
        />
      </div>
    </div>
  );
}
