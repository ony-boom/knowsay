"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUserId } from "@/lib/actions/get-user";
import { getAllMessages } from "@/lib/messages/get-messages";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MessageIndicator() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUnreadMessages = async () => {
      try {
        const userId = await getCurrentUserId();
        const allMessages = await getAllMessages();
        
        // Count unread messages where current user is the receiver
        const unreadMessages = allMessages.filter(
          message => !message.is_read && message.receiver_id === userId
        ).length;
        
        setUnreadCount(unreadMessages);
      } catch (error) {
        console.error("Failed to load unread messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUnreadMessages();

    // Check for new messages every minute
    const intervalId = setInterval(loadUnreadMessages, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return null;

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/home/messages">
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
