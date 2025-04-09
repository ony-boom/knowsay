"use client";
import useSWR from "swr";
import { getMessagesBetweenUsers } from "@/lib/messages/get-messages";
import { ChatBubble, ChatBubbleActionWrapper, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { MessageContent } from "@/lib/definitions";
import moment from "moment";
import { Check } from "lucide-react";

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
          <ChatBubbleActionWrapper>
            <div className=" flex gap-1 justify-center items-center">
              {message.is_read && (<Check size={8} />)}
              <p className="text-xs/5">{moment(message.created_at).fromNow()}</p>
            </div>
          </ChatBubbleActionWrapper>
        </ChatBubble>
      ))}
    </>
  );
}
