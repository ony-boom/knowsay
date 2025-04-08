
"use client"
import { getMessagesBetweenUsers } from "@/lib/messages/get-messages";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat/chat-bubble";
import { useEffect, useState } from "react";

export default function ChatContent({ latestSenderId }: Readonly<{ latestSenderId?: string }>) {
    const [contents, setContents] = useState<{ messages: any[] }>({ messages: [] });
    useEffect(() => {
        if (latestSenderId) {
            getMessagesBetweenUsers(latestSenderId).then((data) => setContents(data)).catch((error) => console.error("Error fetching messages:", error));
        }
    }, [latestSenderId]);

    return (
        <>
            {
                contents.messages.map((message) => (
                    <ChatBubble variant={message.message_type} key={message.message_id}>
                        <ChatBubbleAvatar fallback={message.sender_name[0]} src={message.sender_imageurl} />
                        <ChatBubbleMessage variant={message.message_type}>
                            {message.content}
                        </ChatBubbleMessage>
                    </ChatBubble>
                ))
            }
        </>
    );
}