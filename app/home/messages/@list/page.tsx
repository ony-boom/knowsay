import ContactsList from "@/components/messages/conversation/contacts-list"
import { getAllMessages } from "@/lib/messages/get-messages"

export default async function List({ searchParams }: Readonly<{ searchParams: Promise<{ query?: string }> }>) {
    // Await the searchParams promise first
    const params = await searchParams;
    const term = params?.query ?? "";
    const messages = await getAllMessages(term);
    
    return (
        <div className="flex flex-col h-full relative">
            <ContactsList messages={messages} />
        </div>
    );
}


