export type QuizQcmState = {
  errors?: {
    question?: string[];
    _form?: string[];
  };
  message?: string | null;
  qcmId?: string;
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
