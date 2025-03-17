// Define types for questions and answers
export type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: string;
  question: string;
  answers: Answer[];
};

export interface AnswerUpdateProps {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type QuestionListProps = {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
};
