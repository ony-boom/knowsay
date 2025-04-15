"use client";

import { Button } from "@/components/ui/button";
import { MessageSquarePlus, X } from "lucide-react";
import NewMessage from "@/components/messages/new-message";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { sendMessage } from "@/lib/actions/send-messages";

export default function ContentPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Get the 'compose' param from the URL and use it to control the collapsed state
    const isNewMessageOpen = searchParams.get('compose') === 'true';

    // Update URL when collapsible state changes
    const handleOpenChange = (open: boolean) => {
        const params = new URLSearchParams(searchParams);
        if (open) {
            params.set('compose', 'true');
        } else {
            params.delete('compose');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleSendMessage = async (recipientId: string, message: string) => {
        if (!message.trim() || !recipientId) {
            return;
        }

        try {
            // Create FormData object for the existing sendMessage function
            const formData = new FormData();
            formData.append("content", message.trim());
            formData.append("receiver_id", recipientId);

            const result = await sendMessage(formData);

            if (result.error) {
                console.error("Error sending message:", result.error);
                return;
            }

            // Close the new message UI after sending
            handleOpenChange(false);

            // Redirect to the conversation with the recipient
            router.push(`/home/messages/conversation/${recipientId}`);
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return (
        <div className="flex flex-col h-full items-center justify-center relative">
            <Collapsible
                open={isNewMessageOpen}
                onOpenChange={handleOpenChange}
                className="w-full h-full"
            >
                <CollapsibleTrigger asChild>
                    <Button
                        size="icon"
                        className="fixed bottom-6 right-6 z-10 h-12 w-12 rounded-full shadow-lg"
                    >
                        {isNewMessageOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <MessageSquarePlus className="h-6 w-6" />
                        )}
                    </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="absolute inset-0 z-20 bg-background">
                    <div className="h-full flex flex-col p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">New Message</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenChange(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-auto">
                            <NewMessage
                                onSendAction={handleSendMessage}
                                onClose={() => handleOpenChange(false)}
                                initialSearchTerm={searchParams.get('q') ?? ""}// Add support for a pre-selected user via URL params
                            />
                        </div>
                    </div>
                </CollapsibleContent>

                {!isNewMessageOpen && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6 max-w-md">
                            <h2 className="text-xl font-bold mb-2">Your Messages</h2>
                            <p className="text-muted-foreground">
                                Select a conversation or start a new one
                            </p>
                            <Button
                                className="mt-4 gap-2"
                                onClick={() => handleOpenChange(true)}
                            >
                                <MessageSquarePlus className="h-4 w-4" />
                                New Message
                            </Button>
                        </div>
                    </div>
                )}
            </Collapsible>
        </div>
    );
}
