"use client";
import { useSWRConfig } from "swr";
import { useTransition } from "react";
import { SendHorizonal } from "lucide-react";
import { ChatInput } from "../ui/chat/chat-input";
import { sendMessage } from "@/lib/actions/send-messages";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function ChatBox({ receiverId }: Readonly<{ receiverId: string }>) {
  const { mutate } = useSWRConfig();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const {error, success} = await sendMessage(formData);
      if (error) {
        toast.error(error);
      } else if (success) {
        toast.success(success);
      }
    startTransition(() => {
      mutate(`/messages/${receiverId}`);
    });
    }

  return (
    <form action={handleSubmit} className="flex justify-center items-center mt-4 w-full">
      <input type="hidden" name="receiver_id" value={receiverId ?? ""} />
      <ChatInput placeholder="type your message..." name="content" />
      <Button className="ml-2" type="submit" disabled={isPending}>
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  );
}
