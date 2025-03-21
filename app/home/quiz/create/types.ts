// Define types for questions and answers

import { Question } from "@/schemas/questionSchema";

export type QuestionListProps = {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
};
