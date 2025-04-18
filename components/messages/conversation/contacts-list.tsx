import { SearchInput } from "@/components/search";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessagesList } from "@/lib/messages/get-messages";
import { CornerUpRight } from "lucide-react";
import Link from "next/link";

export default function ContactsList({ messages }: Readonly<{ messages: MessagesList[] }>) {
    return (
        <div className="flex flex-col h-full w-full md:w-[80%] overflow-hiddenflow-hidden sm:w-full gap-4">
            <div className="flex flex-col justify-start">
                <h2 className="text-xl font-semibold mb-4">Contacts</h2>
                <div className="relative flex justify-between items-center w-full max-w-sm">
                    <SearchInput />
                </div>
            </div>
            <ul className="flex md:flex-col w-full gap-3">
                {
                    messages?.map((content) => (
                        <li className={`flex flex-col items-center md:w-full justify-between p-2 ${!content.is_read ? 'bg-blue-50 rounded-md' : ''}`} key={content.message_id}>
                            <Link href={`/home/messages/conversation/${content.correspondent_id}`} className="w-full flex justify-between">
                                <div className="flex min-w-0 gap-x-4 md:w-full">
                                    <div className="relative">
                                        <Avatar className="size-16 lg:size-8">
                                            <AvatarImage src={content.correspondent_image_url} alt={content.correspondent_name} />
                                            <AvatarFallback>{content.correspondent_name[0]}</AvatarFallback>

                                        </Avatar>

                                        <div className="relative flex items-start justify-end w-full h-1">
                                            {content.online ? (
                                                <div className="absolute z-10 bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
                                            ) : (
                                                <div className="absolute z-10 bottom-0 right-0 h-2 w-2 rounded-full bg-red-400 ring-1 ring-white" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="hidden md:flex md:flex-col min-w-0 flex-auto">
                                        <p className="text-sm/6 font-semibold text-gray-900">{content.correspondent_name}</p>
                                        <div className="hidden md:flex w-full items-center md:justify-baseline gap-3">
                                            <span className="md:w-0.5">
                                                {content.correspondent_id !== content.sender_id && (<CornerUpRight className="truncate text-xs/5" size={10} />)}
                                            </span>
                                            <p className={`mt-1 text-xs/5 ${!content.is_read ? 'font-semibold text-gray-800' : 'text-gray-500'} md:truncate md:w-full md:flex-1`}>
                                                {content.content}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 md:flex sm:flex-col sm:items-end">
                                    <div className="flex items-center">
                                        <p className={`text-xs/5 ${!content.is_read ? 'font-semibold' : ''} text-gray-900`}>{content?.sendAt}</p>
                                        {!content.is_read && (
                                            <div className="ml-2 h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div >
    )
}
