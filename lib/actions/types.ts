export type QuestionState = {
  errors?: {
    content?: string[];
    type?: string[];
    quiz_id?: string[];
    _form?: string[];
  };
  message?: string | null;
  questionId?: string;
  success?: boolean;
};

export type State = {
  errors?: {
    title?: string[];
    description?: string[];
    difficulty?: string[];
    categoryId?: string[];
    is_public?: string[];
    _form?: string[];
  };
  message?: string | null;
};
