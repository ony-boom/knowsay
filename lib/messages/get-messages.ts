import { supabase } from "../supabase";
import { getCurrentUserId, getUserInfo } from "../actions/get-user";
import { MessageContent } from "../definitions";
import moment from "moment";

export async function getMessagesFromUser(userId: string) {
    try {
        if (!userId) {

            const { data, error } = await supabase
                .from('messages')
                .select(`
                    message_id,
                    content,
                    is_read,
                    created_at,
                    sender_id,
                    receiver_id,
                    sender:sender_id (
                        id,
                        name,
                        email
                    ),
                    receiver:receiver_id (
                        id,
                        name,
                        email
                    )
                `)
                .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Erreur récupération messages :', error);
                return [];
            }
            return groupMessages(data as unknown as MessageResult[]);
        }
    } catch (e) {
        console.error(e);
    }
    return [];
}

export async function getMessagesBetweenUsers(conversationUserId: string) {
    if (!conversationUserId || !/^[0-9a-fA-F-]{36}$/.test(conversationUserId)) {
        throw new Error('Invalid UUID for userId or otherUserId');
    }
    const userId = await getCurrentUserId();
    const conversationUserInfo = await getUserInfo(conversationUserId);

    try {
        const { data, error } = await supabase
            .rpc('fetch_messages', {
                conversation_user_id: conversationUserId,
                user_id: userId
            });

        if (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
        const messages: MessageContent[] = data.map((message: MessageContent) => ({sendAt: moment(message.created_at).fromNow(), ...message}));

        await markMessagesAsRead(userId);

        return {
            ...conversationUserInfo[0],
            messages,
        } as unknown as {
            id: string; name: string; email: string; imageUrl: string; online: boolean
            messages: MessageContent[];
        };
    } catch (e) {
        console.error(e);
    }

}


export async function markMessagesAsRead(userId: string) {
    const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("receiver_id", userId)
        .eq("is_read", false);

    if (error) {
        console.error("Error on updating messages:", error.message);
    }
}

export async function getAllMessages(search?: string) {
    try {
        const userId = await getCurrentUserId();
        if (!search) {
            const { data: messageData, error: rpcError } = await supabase
                .rpc('get_user_conversations', {
                    p_user_id: userId,
                });
            if (rpcError) console.error(rpcError);
            const corespondantInfos = await getUserInfo(messageData.map((item: MessagesList) => item.correspondent_id));
            return messageData.map((item: MessagesList) => ({ sendAt: moment(item.created_at).fromNow(), ...item, ...corespondantInfos.find(info => info.id === item.correspondent_id) })) as MessagesList[];
        } else {
            const { data: messageData, error: rpcError } = await supabase
                .rpc('get_filtered_user_conversations', {
                    p_user_id: userId,
                    p_search_term: search
                });
            if (rpcError) console.error(rpcError);
            const corespondantInfos = await getUserInfo(messageData.map((item: MessagesList) => item.correspondent_id));
            return messageData.map((item: MessagesList) => ({ sendAt: moment(item.created_at).fromNow(), ...item, ...corespondantInfos.find(info => info.id === item.correspondent_id) })) as MessagesList[];
        }
    } catch (e) {
        console.error(e);
        return [];
    }
}

export type MessageGroup = Record<string, {
    id: string;
    user: { id: string; name: string; email: string };
    messages: Array<{ direction: 'sent' | 'received' }>;
}>

export type MessagesList = {
    content: string;
    online?: boolean;
    correspondent_email: string;
    correspondent_id: string;
    correspondent_image_url: string;
    correspondent_name: string;
    created_at: string;
    sendAt?: string;
    is_read: boolean;
    message_id: string;
    receiver_id: string;
    sender_id: string;
}

const groupMessages = async (data: MessageResult[]) => {
    const currentUserId = await getCurrentUserId();

    const groupedMessages = {} as MessageGroup;

    data.forEach((msg) => {
        const isSent = msg.sender_id === currentUserId;
        const correspondent = isSent ? msg.receiver : msg.sender;

        const correspondentId = correspondent?.id;

        if (!correspondentId) return;

        if (!groupedMessages[correspondentId]) {
            groupedMessages[correspondentId] = {
                id: correspondentId,
                user: correspondent,
                messages: [],
            };
        }

        groupedMessages[correspondentId].messages.push({
            ...msg,
            direction: isSent ? 'sent' : 'received',
        });
    });
    const users = await getUserInfo(Object.keys(groupedMessages))
    return Object.keys(groupedMessages).map((key) => (
        {
            ...groupedMessages[key],
            user: users.find((user) => user.id === key) || { ...groupedMessages[key].user, imageUrl: "" },
        }
    ));

}

type MessageResult = {
    message_id: string;
    content: string;
    is_read: string;
    created_at: string;
    sender_id: string;
    receiver_id: string;
    sender: {
        id: string;
        name: string;
        email: string;
    };
    receiver: {
        id: string;
        name: string;
        email: string;
    };
}