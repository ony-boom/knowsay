import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { getAllMessages } from "@/lib/messages/get-messages"
import { Search } from "lucide-react"
import Link from "next/link"

export default async function SenderList() {

    const messages = await getAllMessages();
    return (
        <div className="flex flex-col max-h-[300px] w-full overflow-hidden">
            <div className="flex flex-col justify-start bg-gray-50">
                <h2 className="text-xl font-semibold mb-4">Contacts</h2>
                <div className="relative w-full max-w-sm">
                    <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                    <Input
                        type="search"
                        placeholder="Search participants or teams..."
                        className="pl-8"
                    />
                </div>
            </div>
            <Separator className="my-4" />
            <ul className=" divide-y divide-gray-100">
                <ScrollArea className="h-72" >
                    {
                        messages?.map((content) => (
                            <li className="flex flex-col items-center justify-between py-5" key={content.id}>
                                <Link href={`/home/messages/${content.id}/conversation`} className="w-full flex justify-between">
                                    <div className="flex min-w-0 gap-x-4">
                                        <img className="size-12 flex-none rounded-full bg-gray-50" src={content.user.imageUrl} alt="" />
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-sm/6 font-semibold text-gray-900">{content.user?.name}</p>
                                            <p className="mt-1 truncate text-xs/5 text-gray-500">{content.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                        <p className="text-sm/6 text-gray-900">{content.messages.length}</p>
                                        <p className="mt-1 text-xs/5 text-gray-500">{content.messages[0].direction}</p>
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