import NewMessage from "@/components/messages/new-message";
import { redirect } from "next/navigation";
import { sendMessage } from "@/lib/actions/send-messages";
import { User } from "@/lib/definitions";
import { searchUsers } from "@/lib/actions/get-users";
import { use } from "react";

export default function NewMessagePage({ 
  searchParams 
}: Readonly<{ 
  searchParams: Promise<{ q?: string, userId?: string }>
}>) {
  // Unwrap searchParams with React.use()
  const params = use(searchParams);
  
  // Handle search term if provided in URL
  const searchTerm = params.q ?? "";
  
  // Handle pre-selected user if provided in URL
  let selectedUser: User | null = null;
  if (params.userId) {
    // Use use() to unwrap the promise from searchUsers
    const users = use(searchUsers(params.userId));
    selectedUser = users.find(user => user.id === params.userId) || null;
  }

  // Function to send a message and redirect
  const handleSendMessage = async (recipientId: string, content: string) => {
    "use server";
    
    if (!content.trim() || !recipientId) {
      return;
    }
    
    // Create FormData object for the existing sendMessage function
    const formData = new FormData();
    formData.append("content", content.trim());
    formData.append("receiver_id", recipientId);
    
    const result = await sendMessage(formData);
    
    if (result.error) {
      throw new Error(result.error);
    }
    
    redirect(`/home/messages/conversation/${recipientId}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <NewMessage 
        onSendAction={handleSendMessage} 
        onClose={() => redirect('/home/messages')} 
        initialSearchTerm={searchTerm}
        initialSelectedUser={selectedUser}
      />
    </div>
  );
}
