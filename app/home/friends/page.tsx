"use client";

import {
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest
} from "@/components/friends/friend-actions";
import { FriendCard } from "@/components/friends/friend-card";
import { FriendRequestCard } from "@/components/friends/friend-request-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebounce } from "@/hooks/use-debounce";
import { getCurrentUserId } from "@/lib/actions/get-user";
import { FriendWithDetails, User } from "@/lib/definitions";
import { getFriendRequests, getFriends, searchPotentialFriends } from "@/lib/friendship/get-friends";
import { Search, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Helper components for conditional rendering
const EmptyState = ({ title, description }: { title: string, description: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  </Card>
);

const LoadingState = ({ text }: { text: string }) => (
  <p className="text-center text-muted-foreground">{text}</p>
);

// Friends Tab Component
const FriendsTabContent = ({ 
  isLoading, 
  friends, 
  onRemoveFriend 
}: {
  isLoading: boolean;
  friends: FriendWithDetails[];
  onRemoveFriend: (friendshipId: string) => Promise<void>;
}) => {
  if (isLoading) {
    return <LoadingState text="Loading your friends..." />;
  }

  if (friends.length === 0) {
    return (
      <EmptyState
        title="No friends yet"
        description="Search for users and send them friend requests to connect"
      />
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {friends.map((friend) => (
        <FriendCard 
          key={friend.id}
          friend={friend}
          onRemove={onRemoveFriend}
        />
      ))}
    </div>
  );
};

// Request Card List Component
const RequestCardList = ({
  isLoading,
  requests,
  type,
  onAccept,
  onDecline,
  emptyTitle,
  emptyDescription
}: {
  isLoading: boolean;
  requests: FriendWithDetails[];
  type: "incoming" | "outgoing";
  onAccept?: (id: string) => Promise<void>;
  onDecline?: (id: string) => Promise<void>;
  emptyTitle: string;
  emptyDescription: string;
}) => {
  if (isLoading) {
    return <LoadingState text="Loading requests..." />;
  }

  if (requests.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid gap-4">
      {requests.map((request) => (
        <FriendRequestCard
          key={request.friendship_id}
          request={request}
          type={type}
          onAccept={onAccept}
          onDecline={onDecline}
        />
      ))}
    </div>
  );
};

// Requests Tab Component
const RequestsTabContent = ({
  isLoading,
  incomingRequests,
  outgoingRequests,
  onAcceptRequest,
  onDeclineRequest
}: {
  isLoading: boolean;
  incomingRequests: FriendWithDetails[];
  outgoingRequests: FriendWithDetails[];
  onAcceptRequest: (id: string) => Promise<void>;
  onDeclineRequest: (id: string) => Promise<void>;
}) => {
  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
      <div>
        <h3 className="text-lg font-semibold mb-4">Incoming Requests</h3>
        <RequestCardList
          isLoading={isLoading}
          requests={incomingRequests}
          type="incoming"
          onAccept={onAcceptRequest}
          onDecline={onDeclineRequest}
          emptyTitle="No incoming requests"
          emptyDescription="You don't have any pending friend requests"
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Outgoing Requests</h3>
        <RequestCardList
          isLoading={isLoading}
          requests={outgoingRequests}
          type="outgoing"
          emptyTitle="No outgoing requests"
          emptyDescription="You haven't sent any friend requests"
        />
      </div>
    </div>
  );
};

// Search Results Component
const SearchResultItem = ({
  user,
  onSendRequest
}: {
  user: User;
  onSendRequest: (userId: string) => Promise<void>;
}) => {
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "??";

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 gap-4"
    >
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={user.imageUrl} alt={user.name || "User"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name || "Unnamed User"}</p>
          <p className="text-sm text-muted-foreground">
            {user.email}
          </p>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="gap-2 w-full sm:w-auto"
        onClick={() => user.id && onSendRequest(user.id)}
      >
        <UserPlus className="h-4 w-4" />
        Add Friend
      </Button>
    </div>
  );
};

// Search Results Display Component
const SearchResultsDisplay = ({ 
  isSearching, 
  searchTerm, 
  searchResults, 
  onSendRequest 
}: { 
  isSearching: boolean;
  searchTerm: string;
  searchResults: User[];
  onSendRequest: (userId: string) => Promise<void>;
}) => {
  if (isSearching) {
    return <LoadingState text="Searching for users..." />;
  }
  
  if (searchTerm.length < 2) {
    return <p className="text-center text-muted-foreground">Type at least 2 characters to search</p>;
  }
  
  if (searchResults.length === 0) {
    return <p className="text-center text-muted-foreground">No users found matching your search</p>;
  }
  
  return (
    <div className="grid gap-4">
      {searchResults.map((user) => (
        <SearchResultItem 
          key={user.id} 
          user={user} 
          onSendRequest={onSendRequest} 
        />
      ))}
    </div>
  );
};

// Find Friends Tab Component
const FindFriendsTabContent = ({
  searchTerm,
  isSearching,
  searchResults,
  onSendRequest
}: {
  searchTerm: string;
  isSearching: boolean;
  searchResults: User[];
  onSendRequest: (userId: string) => Promise<void>;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Find New Friends</CardTitle>
        <CardDescription>
          Search for users by name or email to connect with them
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchResultsDisplay
          isSearching={isSearching}
          searchTerm={searchTerm}
          searchResults={searchResults}
          onSendRequest={onSendRequest}
        />
      </CardContent>
    </Card>
  );
};

// Page Header Component
const PageHeader = ({ 
  searchTerm, 
  onSearchChange 
}: { 
  searchTerm: string; 
  onSearchChange: (value: string) => void; 
}) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <hgroup className="space-y-2 md:space-y-4">
      <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
        Friends
      </h1>
      <p className="text-foreground/80 text-base md:text-lg">
        Connect with other users and manage your network
      </p>
    </hgroup>
    
    <div className="relative max-w-sm w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for users..."
        className="w-full pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </div>
);

// Main component
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
        
        if (!userId) return;
        
        // Use Promise.all for concurrent requests
        const [friendsList, requests] = await Promise.all([
          getFriends(userId),
          getFriendRequests(userId)
        ]);
        
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

  const refreshData = async () => {
    if (!currentUserId) return;
    
    try {
      const [friendsList, requests] = await Promise.all([
        getFriends(currentUserId),
        getFriendRequests(currentUserId)
      ]);
      
      setFriends(friendsList);
      setIncomingRequests(requests.incoming);
      setOutgoingRequests(requests.outgoing);
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast.error("Failed to refresh data");
    }
  };

  const handleSendRequest = async (userId: string) => {
    if (!currentUserId) return;
    
    try {
      await sendFriendRequest(currentUserId, userId);
      toast.success("Friend request sent!");
      
      // Refresh search results and outgoing requests
      const [results, requests] = await Promise.all([
        searchPotentialFriends(currentUserId, debouncedSearchTerm),
        getFriendRequests(currentUserId)
      ]);
      
      setSearchResults(results);
      setOutgoingRequests(requests.outgoing);
    } catch (error) {
      console.error("Failed to send friend request:", error);
      toast.error("Failed to send friend request");
    }
  };

  const handleAcceptRequest = async (friendshipId: string) => {
    if (!currentUserId) return;
    
    try {
      await acceptFriendRequest(friendshipId, currentUserId);
      toast.success("Friend request accepted!");
      await refreshData();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
      toast.error("Failed to accept friend request");
    }
  };

  const handleDeclineRequest = async (friendshipId: string) => {
    if (!currentUserId) return;
    
    try {
      await declineFriendRequest(friendshipId, currentUserId);
      toast.success("Friend request declined");
      
      // Only need to refresh incoming requests
      const requests = await getFriendRequests(currentUserId);
      setIncomingRequests(requests.incoming);
    } catch (error) {
      console.error("Failed to decline friend request:", error);
      toast.error("Failed to decline friend request");
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    if (!currentUserId) return;
    
    try {
      await removeFriend(friendshipId, currentUserId);
      toast.success("Friend removed");
      
      // Only need to refresh friends list
      const friendsList = await getFriends(currentUserId);
      setFriends(friendsList);
    } catch (error) {
      console.error("Failed to remove friend:", error);
      toast.error("Failed to remove friend");
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      <PageHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      
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
          <FriendsTabContent 
            isLoading={isLoading} 
            friends={friends} 
            onRemoveFriend={handleRemoveFriend}
          />
        </TabsContent>
        
        <TabsContent value="requests" className="mt-6">
          <RequestsTabContent
            isLoading={isLoading}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
          />
        </TabsContent>
        
        <TabsContent value="find" className="mt-6">
          <FindFriendsTabContent
            searchTerm={debouncedSearchTerm}
            isSearching={isSearching}
            searchResults={searchResults}
            onSendRequest={handleSendRequest}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}