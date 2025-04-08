import { SendHorizonal } from "lucide-react";
import { ChatInput } from "../ui/chat/chat-input";
import { sendMessage } from "@/lib/actions/send-messages";
export default function ChatBox({ receiverId }: Readonly<{ receiverId: string }>) {
  return (
    <form action={sendMessage} className="flex justify-center items-center mt-4 w-full">
      <input
        type="hidden"
        name="receiver_id"
        value={receiverId}
      />
      <ChatInput
        placeholder="type your message..."
        name="content"
      />
      <button className="ml-2" type="submit">
        <SendHorizonal className="h-4 w-4" />
      </button>
    </form>
  )
}
