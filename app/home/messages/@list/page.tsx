import { SearchInput } from "@/components/search"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getAllMessages } from "@/lib/messages/get-messages"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CornerUpRight } from "lucide-react"
import moment from "moment"
import Link from "next/link"

export default async function SenderList({ searchParams }: Readonly<{ searchParams: Promise<{ query?: string }> }>) {
    const params = await searchParams;
    const term = params.query ?? "";
    const messages = await getAllMessages(term);
    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex flex-col justify-start bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Contacts</h2>
                <div className="relative w-full max-w-sm">
                    <SearchInput />
                </div>
            </div>
            <Separator className="my-4" />
            <ul className="divide-y divide-gray-100">
                <ScrollArea className="h-72">
                    {
                        messages?.map((content) => (
                            <li className="flex flex-col items-center justify-between py-5" key={content.message_id}>
                                <Link href={`/home/messages/${content.correspondent_id}/conversation`} className="w-full flex justify-between">
                                    <div className="flex min-w-0 gap-x-4">
                                        <Avatar>
                                            <AvatarImage src={content.correspondent_image_url} alt={content.correspondent_name} />
                                            <AvatarFallback>{content.correspondent_name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm/6 font-semibold text-gray-900 hidden md:block sm:hidden">{content.correspondent_name}</p>
                                            <div className="flex w-full items-center gap-4 md:hidden">
                                                {content.correspondent_id !== content.sender_id && (<CornerUpRight className="truncate text-xs/5" size={10} />)}
                                                <p className="mt-1 truncate text-xs/5 text-gray-500 md:block sm:hidden">
                                                    {content.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm/6 text-gray-900">{moment(content.created_at).fromNow()}</p>
                                    </div>
                                </Link>
                                <Separator className="my-4" />
                            </li>
                        ))
                    }
                </ScrollArea>
            </ul>
        </div>
    )
}