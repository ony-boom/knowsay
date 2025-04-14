"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { searchUsers } from "@/lib/actions/get-users";
import { User } from "@/lib/definitions";
import { Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type NewMessageProps = {
    onSendAction: (recipientId: string, message: string) => Promise<void>;
    onClose?: () => void;
    initialSearchTerm?: string;
    initialSelectedUser?: User | null;
};

export default function NewMessage({ 
    onSendAction, 
    onClose, 
    initialSearchTerm = "", 
    initialSelectedUser = null 
}: Readonly<NewMessageProps>) {
    const messageRef = useRef<HTMLTextAreaElement>(null);
    
    // Local state for form handling
    const [searchQuery, setSearchQuery] = useState(initialSearchTerm);
    const [selectedUser, setSelectedUser] = useState<User | null>(initialSelectedUser);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    // Debounce search input to reduce API calls
    const debouncedSearchTerm = useDebounce(searchQuery, 300);

    // Handle search based on debounced query
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.length >= 2) {
                setIsSearching(true);
                try {
                    const users = await searchUsers(debouncedSearchTerm);
                    setSearchResults(users);
                } catch (error) {
                    console.error("Failed to fetch users:", error);
                    setSearchResults([]);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        };

        performSearch();
    }, [debouncedSearchTerm]);

    // Set initial values when they arrive from props
    useEffect(() => {
        if (initialSearchTerm) {
            setSearchQuery(initialSearchTerm);
        }
        if (initialSelectedUser) {
            setSelectedUser(initialSelectedUser);
        }
    }, [initialSearchTerm, initialSelectedUser]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleClearUser = () => {
        setSelectedUser(null);
    };

    const handleSendMessage = async () => {
        if (!selectedUser?.id || !messageRef.current?.value.trim()) return;
        
        try {
            setIsSending(true);
            await onSendAction(selectedUser.id, messageRef.current.value);
            if (messageRef.current) messageRef.current.value = "";
            setSelectedUser(null);
            if (onClose) onClose();
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
                                onClick={handleClearUser}
                            >
                                <span className="sr-only">Remove</span>
                                <span aria-hidden="true">&times;</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="relative mt-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="recipient"
                                    type="text"
                                    placeholder="Search for a user..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            {searchResults.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
                                    <ul className="py-1">
                                        {searchResults.map(user => (
                                            <li
                                                key={user.id}
                                                className="px-3 py-2 hover:bg-muted"
                                            >
                                                <Button 
                                                    variant="ghost" 
                                                    className="w-full justify-start gap-2" 
                                                    onClick={() => handleSelectUser(user)}
                                                >
                                                    <Avatar className="h-6 w-6">
                                                        {user.imageUrl ? (
                                                            <AvatarImage src={user.imageUrl} alt={user.name} />
                                                        ) : (
                                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div className="text-left">
                                                        <p className="text-sm font-medium">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                                    </div>
                                                </Button>
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
                        ref={messageRef}
                    />
                </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSendMessage}
                    disabled={!selectedUser || isSending}
                    className="gap-2"
                >
                    <Send className="h-4 w-4" />
                    Send
                </Button>
            </CardFooter>
        </Card>
    );
}
