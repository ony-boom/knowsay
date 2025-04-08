import { getAllMessages } from '@/lib/messages/get-messages'
import { supabase } from '@/lib/supabase'
import { create } from 'zustand'

type LatestChatState = {
  latestSenderId: string | null
  lastSenderBackup: string | null
  setLatestSender: (id: string) => void
  subscribeToLatestMessages: (currentUserId: string) => () => void;
  initializeFromHistory: () => Promise<any>
}

export const useLatestChatStore = create<LatestChatState>((set, get) => {
  let inactivityTimeout: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    if (inactivityTimeout) clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      const { latestSenderId } = get();
      set(() => ({ latestSenderId: null })); // efface latestSenderId après délai
    }, 30000); // 30 secondes sans nouveau message
  }

  return {
    latestSenderId: null,
    lastSenderBackup: null,

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
        const allMessages = await getAllMessages()
    
        const lastMessage = allMessages[0];
    
        if (lastMessage) {
          const fallbackId = lastMessage.user.id;
          set(() => ({
            latestSenderId: fallbackId as string,
            lastSenderBackup: fallbackId as string,
          }))
        }
      },
  };
});
