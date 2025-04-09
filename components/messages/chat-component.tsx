
import { getCurrentUserId } from "@/lib/actions/get-user";
import FloatingBubble from "./floating-bubble";

export default async function ChatComponent() { 
  const currentUserId = await getCurrentUserId(); 

  return <FloatingBubble currentUserId={currentUserId}/>;
}

