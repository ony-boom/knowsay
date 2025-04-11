import ContactsList from "@/components/messages/conversation/contacts-list"
import { getAllMessages } from "@/lib/messages/get-messages"

export default async function SenderList({ searchParams }: Readonly<{ searchParams: Promise<{ query?: string }> }>) {
    const params = await searchParams;
    const term = params.query ?? "";
    const messages = await getAllMessages(term);
    return (
        <ContactsList messages={messages} />
    )
}