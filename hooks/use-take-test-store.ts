import { create } from "zustand/react";

interface TakeTestStore {
  submited: boolean;
  started: boolean;

  testAnswers: Record<
    string,
    {
      selected: string;
      freeAnswer: string;
    }
  >;

  hasAnswered: () => boolean;

  setTestAnswers: (params: {
    answer: string;
    isFreeText: boolean;
    questionId: string;
  }) => void;
}

export const useTakeTestStore = create<TakeTestStore>((set, get) => ({
  started: false,
  submited: false,
  testAnswers: {},

  hasAnswered: () => {
    return Object.keys(get().testAnswers).length > 0;
  },

  setTestAnswers: (params) => {
    set((state) => {
      const { answer, isFreeText, questionId } = params;
      return {
        testAnswers: {
          ...state.testAnswers,
          [questionId]: {
            ...(state.testAnswers[questionId] || {}),
            [isFreeText ? "freeAnswer" : "selected"]: answer,
          },
        },
      };
    });
  },
}));
