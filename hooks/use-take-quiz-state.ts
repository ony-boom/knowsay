import { create } from "zustand/react";

interface UseTakeQuizState {
  totalQuestions: number;
  currentQuestion: number;
  score: number;
  finishedQuestions: Set<string>;
  currentQuestionTimeout: number;

  // Add selected answers tracking to the store
  selectedAnswers: Record<string, { value: string; isCorrect: boolean }>;

  incrementScore: () => void;
  nextQuestion: () => void;
  setQuestionAsFinished: (questionId: string) => void;
  previousQuestion: () => void;

  // Add new actions for managing selected answers
  setSelectedAnswer: (
    questionId: string,
    value: string,
    isCorrect: boolean,
  ) => void;

  reset: () => void;
}

export const useTakeQuizState = create<UseTakeQuizState>((set) => {
  return {
    totalQuestions: 0,
    currentQuestion: 0,
    score: 0,
    currentQuestionTimeout: 0,
    finishedQuestions: new Set<string>(),
    selectedAnswers: {},

    incrementScore: () => {
      set((prev) => ({
        score: prev.score + 1,
      }));
    },

    nextQuestion: () => {
      set((prev) => ({
        ...prev,
        currentQuestion:
          prev.currentQuestion +
          Number(prev.currentQuestion < prev.totalQuestions),
      }));
    },

    previousQuestion: () => {
      set((prev) => ({
        ...prev,
        currentQuestion:
          prev.currentQuestion - Number(prev.currentQuestion > 0),
      }));
    },

    setQuestionAsFinished: (questionId: string) => {
      set((prev) => ({
        finishedQuestions: new Set(prev.finishedQuestions).add(questionId),
      }));
    },

    setSelectedAnswer: (
      questionId: string,
      value: string,
      isCorrect: boolean,
    ) => {
      set((prev) => ({
        selectedAnswers: {
          ...prev.selectedAnswers,
          [questionId]: { value, isCorrect },
        },
      }));
    },

    reset: () => {
      set({
        currentQuestion: 0,
        score: 0,
        finishedQuestions: new Set<string>(),
        selectedAnswers: {},
      });
    },
  };
});
