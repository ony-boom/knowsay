import { supabase } from '@/lib/supabase';
import { getCurrentUserId } from '@/lib/actions/get-user';

type CreateMessageProps = {
  receiverId: string;
  content: string;
};

export async function createMessage({ receiverId, content }: CreateMessageProps) {
  'use server';
  
  if (!content.trim() || !receiverId) {
    throw new Error('Message content and receiver ID are required');
  }

  // Get the current user's ID
  const senderId = await getCurrentUserId();
  
  if (!senderId) {
    throw new Error('User must be authenticated to send messages');
  }

  // Create a new message in the database
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim(),
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error('Error creating message:', error);
    throw new Error('Failed to send message');
  }

  return data?.[0] || null;
}
