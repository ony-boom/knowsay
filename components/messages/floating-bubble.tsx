"use client"
import { useLatestChatStore } from "@/hooks/use-latest-chat-store";
import { getUserInfo } from "@/lib/actions/get-user";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { ChatMessageList } from "../ui/chat/chat-message-list";
import { ExpandableChat, ExpandableChatBody, ExpandableChatFooter, ExpandableChatHeader } from "../ui/chat/expandable-chat";
import ChatContent from "./chat-content";
import ChatBox from "./chat-box";
import { toast } from "sonner";
import { Circle } from "lucide-react";


export default function FloatingBubble({ currentUserId }: Readonly<{ currentUserId: string }>) {
  const { latestSenderId,
    lastSenderBackup,
    subscribeToLatestMessages,
    initializeFromHistory,
    lastMessageContent,
    showPreview,
    unreadMessages
  } = useLatestChatStore((state) => state)

  const [latestSender, setLatestSender] = useState<{ id: string; name: string, imageUrl: string, email: string, online: boolean } | null>(null)

  // Unsubscribe from the channel when the component unmounts
  // and subscribe to the latest messages when the component mounts

  useEffect(() => {
    const unsubscribe = subscribeToLatestMessages(currentUserId);
    const init = async () => initializeFromHistory();
    init();
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {

    if (showPreview && latestSender?.name) {
      toast.message(`💬  ${latestSender?.name} : "${lastMessageContent}"`, {
        duration: 5000,
        position: "bottom-right",
        action: {
          label: "Open",
          onClick: () => {
          }
        }
      });
    }
  }, [lastMessageContent, showPreview, latestSender?.name]);


  useEffect(() => {
    const fetchSender = async () => {
      if (!latestSenderId) return;
      const userData = await getUserInfo(latestSenderId);
      if (userData && userData.length > 0) {
        setLatestSender(userData[0]);
      }
    };
    fetchSender();
  }, [latestSenderId]);

  return (
    <ExpandableChat
      size="md"
      icon={<ImageBubble latestSender={latestSender} unreadMessages={unreadMessages}/>}
      position="bottom-right"
    >
      <ExpandableChatHeader className="flex-col text-center justify-center">

        <h1 className="text-xl font-semibold flex items-center gap-2">
          <span>
            {latestSender?.online ? (<Circle className="text-green-500" size={12} />) : (<Circle className="text-red-500" size={12} />)}
          </span>{latestSender?.name}</h1>
        <div className="flex gap-2 items-center pt-2">
          <Button variant="secondary" type="button">New Chat</Button>
        </div>
      </ExpandableChatHeader>
      <ExpandableChatBody>
        <ChatMessageList
          className="dark:bg-muted/40"
        >
          <ChatContent latestSenderId={latestSender?.id} />
        </ChatMessageList>
      </ExpandableChatBody>
      <ExpandableChatFooter>
        <ChatBox receiverId={latestSender?.id ?? lastSenderBackup!} />
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}

const ImageBubble = ({ latestSender, unreadMessages }: Readonly<{ latestSender: UserLike | null, unreadMessages: number }>) => {
  return (
    <div className="relative">
      <Avatar className="size-12">
        <AvatarImage
          src={latestSender?.imageUrl}
          alt="Avatar"
        />
        <AvatarFallback className="size-12 flex items-center justify-center"><h3 className="text-2xl">
          {latestSender?.name[0]}</h3></AvatarFallback>
      </Avatar>
      {unreadMessages > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {unreadMessages > 9 ? "9+" : unreadMessages}
        </span>
      )}
    </div>
  )
}

type UserLike = { id: string; name: string, imageUrl: string, email: string };