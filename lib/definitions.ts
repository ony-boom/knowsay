export type User = {
  id?: string;
  name: string;
  password_hash?: string;
  role: "super_admin"| "user"| "corrector";
  email: string;
  clerk_id: string;
};

export type LeaderBoardEntry = {
  user_id: string;
  user_clerk_id: string;
  user_name: string;
  total_quiz_score: number;
  total_test_score: number;
  total_challenges_completed: number;
  total_score: number;
};
