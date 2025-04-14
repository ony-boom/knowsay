"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";
import { FriendWithDetails, User } from "@/lib/definitions";
import { Search, UserPlus, UserX, Check, X, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getFriends, getFriendRequests, searchPotentialFriends } from "@/lib/friendship/get-friends";
import { getCurrentUserId } from "@/lib/actions/get-user";
import { 
  acceptFriendRequest, 
  declineFriendRequest, 
  removeFriend, 
  sendFriendRequest 
} from "@/components/friends/friend-actions";
import Link from "next/link";
import { FriendCard } from "@/components/friends/friend-card";
import { FriendRequestCard } from "@/components/friends/friend-request-card";
import { toast } from "sonner";

export default function FriendsPage() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [friends, setFriends] = useState<FriendWithDetails[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendWithDetails[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendWithDetails[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Load current user ID and initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const userId = await getCurrentUserId();
        setCurrentUserId(userId);
        
        // Load friends and requests
        const friendsList = await getFriends(userId);
        const requests = await getFriendRequests(userId);
        
        setFriends(friendsList);
        setIncomingRequests(requests.incoming);
        setOutgoingRequests(requests.outgoing);
      } catch (error) {
        console.error("Failed to load friends data:", error);
        toast.error("Failed to load friends data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!currentUserId || debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        return;
      }
      
      try {
        setIsSearching(true);
        const results = await searchPotentialFriends(currentUserId, debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error("Failed to search users:", error);
        toast.error("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchTerm, currentUserId]);

  const handleSendRequest = async (userId: string) => {
    if (!currentUserId) return;
    
    try {
      await sendFriendRequest(currentUserId, userId);
      toast.success("Friend request sent!");
      
      // Refresh search results
      const results = await searchPotentialFriends(currentUserId, debouncedSearchTerm);
      setSearchResults(results);
      
      // Refresh outgoing requests
      const requests = await getFriendRequests(currentUserId);
      setOutgoingRequests(requests.outgoing);
    } catch (error) {
      console.error("Failed to send friend request:", error);
      toast.error("Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    try {
      await acceptFriendRequest(friendshipId, currentUserId!);
      toast.success("Friend request accepted!");
      
      // Refresh friends list and incoming requests
      const friendsList = await getFriends(currentUserId!);
      const requests = await getFriendRequests(currentUserId!);
      
      setFriends(friendsList);
      setIncomingRequests(requests.incoming);
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      toast.error("Failed to accept friend request");
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    try {
      await declineFriendRequest(friendshipId, currentUserId!);
      toast.success("Friend request declined");
      
      // Refresh incoming requests
      const requests = await getFriendRequests(currentUserId!);
      setIncomingRequests(requests.incoming);
    } catch (error) {
      console.error("Failed to decline friend request:", error);
      toast.error("Failed to decline friend request");
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      await removeFriend(friendshipId, currentUserId!);
      toast.success("Friend removed");
      
      // Refresh friends list
      const friendsList = await getFriends(currentUserId!);
      setFriends(friendsList);
    } catch (error) {
      console.error("Failed to remove friend:", error);
      toast.error("Failed to remove friend");
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2 md:space-y-4">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            Friends
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Connect with other users and manage your network
          </p>
        </hgroup>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for users..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="friends" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="friends">
            My Friends
            {friends.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {friends.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            Requests
            {incomingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {incomingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="find">Find Friends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="friends" className="mt-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading your friends...</p>
          ) : friends.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No friends yet</CardTitle>
                <CardDescription>
                  Search for users and send them friend requests to connect
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <FriendCard 
                  key={friend.id}
                  friend={friend}
                  onRemove={handleRemoveFriend}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="requests" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-4">Incoming Requests</h3>
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading requests...</p>
              ) : incomingRequests.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No incoming requests</CardTitle>
                    <CardDescription>
                      You don't have any pending friend requests
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {incomingRequests.map((request) => (
                    <FriendRequestCard
                      key={request.friendship_id}
                      request={request}
                      type="incoming"
                      onAccept={handleAcceptRequest}
                      onDecline={handleDeclineRequest}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Outgoing Requests</h3>
              {isLoading ? (
                <p className="text-center text-muted-foreground">Loading requests...</p>
              ) : outgoingRequests.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No outgoing requests</CardTitle>
                    <CardDescription>
                      You haven't sent any friend requests
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {outgoingRequests.map((request) => (
                    <FriendRequestCard
                      key={request.friendship_id}
                      request={request}
                      type="outgoing"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="find" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Find New Friends</CardTitle>
              <CardDescription>
                Search for users by name or email to connect with them
              </CardDescription>
            </CardHeader>
            <CardContent>
              {debouncedSearchTerm.length < 2 ? (
                <p className="text-center text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              ) : isSearching ? (
                <p className="text-center text-muted-foreground">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  No users found matching "{debouncedSearchTerm}"
                </p>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map((user) => {
                    const initials = user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2);
                    
                    return (
                      <div
                        key={user.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={user.imageUrl} alt={user.name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleSendRequest(user.id!)}
                        >
                          <UserPlus className="h-4 w-4" />
                          Add Friend
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
