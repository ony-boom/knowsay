import ChatBox from "@/components/messages/chat-box"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { ChatBubble, ChatBubbleActionWrapper, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble"
import { ChatMessageList } from "@/components/ui/chat/chat-message-list"
import { Separator } from "@/components/ui/separator"
import { getMessagesBetweenUsers } from "@/lib/messages/get-messages"
import { AvatarFallback } from "@radix-ui/react-avatar"
import { CircleCheck } from "lucide-react"

export default async function Page({
    params,
}: Readonly<{
    params: Promise<{ id: string }>
}>) {
    const { id } = await params;
    const contents = await getMessagesBetweenUsers(id);
    return (

        <div className="flex flex-col h-full w-full lg:w-[80%] mx-auto overflow-hidden sm:w-full">
            <div className="flex gap-6">
                <Avatar>
                    <AvatarImage src={contents?.imageUrl} />
                    <AvatarFallback>{contents?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-end bg-gray-50">
                    <h2 className="text-xl font-semibold ">{contents?.name}</h2>
                    <p className="mt-1 truncate text-xs/5 text-gray-500">{contents?.email}</p>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col gap-4">
                <ChatMessageList className="max-h-[50vh] overflow-y-auto">
                    {
                        contents?.messages.map((message) => (
                            <ChatBubble variant={message.message_type} key={message.message_id}>
                                <ChatBubbleAvatar fallback={message.sender_name[0]} src={message.sender_imageurl} />
                                <ChatBubbleMessage variant={message.message_type}>
                                    {message.content}
                                </ChatBubbleMessage>
                                <ChatBubbleActionWrapper>
                                    <div className=" flex gap-1 justify-center items-center">
                                        {message.is_read && (<CircleCheck size={8} />)}
                                        <p className="text-xs/5">{message.sendAt}</p>
                                    </div>
                                </ChatBubbleActionWrapper>
                            </ChatBubble>
                        ))
                    }
                </ChatMessageList>
            </div>
            <ChatBox receiverId={contents?.id ?? ""} />
        </div>
    )
}