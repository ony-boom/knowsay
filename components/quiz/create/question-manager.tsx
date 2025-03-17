"use client";

import { useState } from "react";
import { Question } from "../../../app/home/quiz/create/types";
import { AddQuestionButton } from "./add-question-button";
import { SortableQuestionList } from "./sortable-question-list";

export function QuestionsManager() {
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

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddQuestion = () => {
    setCurrentQuestion({
      id: `q${Date.now()}`,
      question: "",
      answers: [
        { id: `a${Date.now()}-1`, text: "", isCorrect: true },
        { id: `a${Date.now()}-2`, text: "", isCorrect: false },
      ],
    });
    setIsEditing(false);
  };

  const handleEditQuestion = (question: Question) => {
    setCurrentQuestion({ ...question });
    setIsEditing(true);
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveQuestion = (question: Question) => {
    if (isEditing) {
      setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
    } else {
      setQuestions([...questions, question]);
    }
    setCurrentQuestion(null);
  };

  const addAnswer = () => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        answers: [
          ...currentQuestion.answers,
          { id: `a${Date.now()}`, text: "", isCorrect: false },
        ],
      });
    }
  };

  const removeAnswer = (id: string) => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        answers: currentQuestion.answers.filter((a) => a.id !== id),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Quiz Questions</h3>

        <AddQuestionButton
          onAddQuestion={handleAddQuestion}
          currentQuestion={currentQuestion}
          isEditing={isEditing}
          onSaveQuestion={handleSaveQuestion}
          addAnswer={addAnswer}
          removeAnswer={removeAnswer}
          setCurrentQuestion={setCurrentQuestion}
        />
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
