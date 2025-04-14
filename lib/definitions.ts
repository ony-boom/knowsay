export type User = {
  id?: string;
  name: string;
  password_hash?: string;
  role: "super_admin" | "user" | "corrector";
  email: string;
  clerk_id: string;
  imageUrl?: string;
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

export type MessageContent = {
  message_id: string,
  content: string,
  is_read: true,
  created_at: string,
  sender_id: string,
  sender_name: string,
  sender_email: string,
  sender_imageurl: string,
  receiver_id: string,
  receiver_name: string,
  receiver_email: string,
  receiver_imageurl: string;
  sendAt?: string;
  message_type: 'sent' | 'received';
}

export type FriendshipStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export interface Friendship {
  friendship_id: string;
  user_id1: string;
  user_id2: string;
  status: FriendshipStatus;
  created_at: string;
  updated_at: string;
}

export interface FriendWithDetails extends User {
  friendship_id: string;
  friendship_status: FriendshipStatus;
  friendship_created_at: string;
  online?: boolean;
}
