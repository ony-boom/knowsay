"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFriendRequests } from "@/lib/friendship/get-friends";
import { getCurrentUserId } from "@/lib/actions/get-user";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function FriendRequestsIndicator() {
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const userId = await getCurrentUserId();
        const { incoming } = await getFriendRequests(userId, "incoming");
        setRequestCount(incoming.length);
      } catch (error) {
        console.error("Failed to load friend requests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();

    // Check for new requests every minute
    const intervalId = setInterval(loadRequests, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) return null;

  return (
    <Button asChild variant="ghost" size="sm" className="relative">
      <Link href="/home/friends?tab=requests">
        <UserPlus className="h-5 w-5" />
        {requestCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0"
          >
            {requestCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}
