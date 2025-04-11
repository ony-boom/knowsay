import { getCurrentUserId } from '@/lib/actions/get-user'
import { getAllMessages } from '@/lib/messages/get-messages'
import { supabase } from '@/lib/supabase'
import moment from 'moment'
import { create } from 'zustand'

type LatestChatState = {
  latestSenderId: string | null
  lastSenderBackup: string | null
  setLatestSender: (id: string) => void
  subscribeToLatestMessages: (currentUserId: string) => () => void;
  lastMessageContent: string | null
  showPreview: boolean;
  unreadMessages: number;
  initializeFromHistory: () => Promise<any>
}

export const useLatestChatStore = create<LatestChatState>((set, get) => {
  let inactivityTimeout: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      const { latestSenderId } = get();
      set(() => ({ latestSenderId: null }));
    }, 5 * 60 * 1000);
  }

  return {
    latestSenderId: null,
    lastSenderBackup: null,
    lastMessageContent: null,
    showPreview: false,
    unreadMessages: 0,

    setLatestSender: (id: string) =>
      set(() => ({
        latestSenderId: id,
        lastSenderBackup: id,
      })),

    subscribeToLatestMessages: (currentUserId: string) => {
      const channel = supabase
        .channel(`latest-chat:${currentUserId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${currentUserId}`,
          },
          (payload) => {
            const message = payload.new;
            const latestSenderId =
              currentUserId !== message.sender_id
                ? message.sender_id
                : message.receiver_id;

            set(() => ({
              latestSenderId,
              lastSenderBackup: latestSenderId,
              lastMessageContent: message.content,
              showPreview: isRecentMessage(message.created_at) && !message.is_read
            }));

            resetInactivityTimer();
          }
        )
        .subscribe();

      return () => {
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
        supabase.removeChannel(channel);
      };
    },
    initializeFromHistory: async () => {
        const allMessages = await getAllMessages();
        const currentUserId = await getCurrentUserId();
    
        const lastMessage = allMessages[0];
        if (lastMessage) {
          const fallbackId = lastMessage.sender_id !== currentUserId ? lastMessage.sender_id : lastMessage.receiver_id;
          set(() => ({
            latestSenderId: fallbackId,
            lastSenderBackup: fallbackId,
            showPreview: isRecentMessage(lastMessage.created_at),
            lastMessageContent: lastMessage.content,
            unreadMessages: allMessages.filter((message) => message.receiver_id === currentUserId && !message.is_read).length,
          }))
        }
      },
  };
});

const isRecentMessage = (dateISOString: string) => {
  const now = moment();
  const messageTime = moment(dateISOString);
  const diffInMinutes = now.diff(messageTime, 'minutes');
  return diffInMinutes <= 5;
}