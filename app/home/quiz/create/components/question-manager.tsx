"use client";

import { useState } from "react";
import { Question } from "../types";
import { QuestionList } from "./question-list";
import { AddQuestionButton } from "./add-question-button";

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

      <QuestionList
        questions={questions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
      />
    </div>
  );
}
