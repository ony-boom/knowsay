"use client";
import useSWR from "swr";
import { getMessagesBetweenUsers } from "@/lib/messages/get-messages";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { MessageContent } from "@/lib/definitions";

const fetcher = (userId: string) => getMessagesBetweenUsers(userId);

export default function ChatContent({ latestSenderId }: Readonly<{ latestSenderId?: string }>) {
  const { data, error, isLoading } = useSWR(
    latestSenderId ? `/messages/${latestSenderId}` : null,
    () => fetcher(latestSenderId!)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load messages.</div>;
  if (!data) return null;

  return (
    <>
      {data.messages.map((message: MessageContent) => (
        <ChatBubble variant={message.message_type} key={message.message_id}>
          <ChatBubbleAvatar
            fallback={message.sender_name[0]}
            src={message.sender_imageurl}
          />
          <ChatBubbleMessage variant={message.message_type}>
            {message.content}
          </ChatBubbleMessage>
        </ChatBubble>
      ))}
    </>
  );
}
