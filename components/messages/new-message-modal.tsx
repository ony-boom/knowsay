"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  id: string;
  name: string;
  email: string;
  imageUrl?: string;
};

type NewMessageProps = {
  onSendAction: (recipientId: string, message: string) => Promise<void>;
  onClose?: () => void;
};

export default function NewMessage({ onSendAction, onClose }: Readonly<NewMessageProps>) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSending, setIsSending] = useState(false);

    // Mock search function - replace with actual API call
    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length > 2) {
            setIsSearching(true);
            // Simulate API call with timeout
            setTimeout(() => {
                // Mock data - replace with actual API response
                setSearchResults([
                    { id: "1", name: "Jane Cooper", email: "jane@example.com", imageUrl: "/avatars/01.png" },
                    { id: "2", name: "John Smith", email: "john@example.com", imageUrl: "/avatars/02.png" },
                    { id: "3", name: "Robert Johnson", email: "robert@example.com" },
                ]);
                setIsSearching(false);
            }, 500);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSearchResults([]);
        setSearchTerm("");
    };

    const handleSendMessage = async () => {
        if (!selectedUser || !message.trim()) return;
        
        try {
            setIsSending(true);
            await onSendAction(selectedUser.id, message);
            setMessage("");
            setSelectedUser(null);
            if (onClose) {
                onClose();
            } else {
                router.back(); // Fallback to router.back() if onClose is not provided
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            router.back();
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader>
                <CardTitle>New Message</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
                <div className="relative">
                    <Label htmlFor="recipient" className="text-sm font-medium">To:</Label>
                    {selectedUser ? (
                        <div className="mt-2 flex items-center gap-2 rounded border p-2">
                            <Avatar className="h-8 w-8">
                                {selectedUser.imageUrl ? (
                                    <AvatarImage src={selectedUser.imageUrl} alt={selectedUser.name} />
                                ) : (
                                    <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm font-medium">{selectedUser.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0" 
                                onClick={() => setSelectedUser(null)}
                            >
                                <span className="sr-only">Remove</span>
                                <span aria-hidden="true">&times;</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="relative mt-2">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="recipient"
                                type="text"
                                placeholder="Search for a user..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                                    <ul className="py-1">
                                        {searchResults.map(user => (
                                            <li 
                                                key={user.id}
                                                className="flex cursor-pointer items-center gap-2 px-3 py-2 hover:bg-muted"
                                                onClick={() => handleSelectUser(user)}
                                            >
                                                <Avatar className="h-6 w-6">
                                                    {user.imageUrl ? (
                                                        <AvatarImage src={user.imageUrl} alt={user.name} />
                                                    ) : (
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {isSearching && (
                                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-4 text-center shadow-md">
                                    Searching...
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div>
                    <Label htmlFor="message" className="text-sm font-medium">Message:</Label>
                    <Textarea
                        id="message"
                        placeholder="Type your message here..."
                        className="mt-2 min-h-[100px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
            </CardContent>
            
            <CardFooter className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSendMessage}
                    disabled={!selectedUser || !message.trim() || isSending}
                    className="gap-2"
                >
                    <Send className="h-4 w-4" />
                    Send
                </Button>
            </CardFooter>
        </Card>
    );
}
