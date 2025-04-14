import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FriendWithDetails } from "@/lib/definitions";
import { Check, Clock, X } from "lucide-react";
import { Badge } from "../ui/badge";

interface FriendRequestCardProps {
  request: FriendWithDetails;
  type: "incoming" | "outgoing";
  onAccept?: (friendshipId: string) => Promise<void>;
  onDecline?: (friendshipId: string) => Promise<void>;
}

export function FriendRequestCard({ 
  request, 
  type, 
  onAccept, 
  onDecline 
}: FriendRequestCardProps) {
  const initials = request.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  // Format date for display
  const requestDate = new Date(request.friendship_created_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={request.imageUrl} alt={request.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{request.name}</p>
              <p className="text-sm text-muted-foreground">{request.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{requestDate}</span>
              </div>
            </div>
          </div>
          
          {type === "incoming" ? (
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="gap-2"
                onClick={() => onAccept?.(request.friendship_id)}
              >
                <Check className="h-4 w-4" />
                Accept
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={() => onDecline?.(request.friendship_id)}
              >
                <X className="h-4 w-4" />
                Decline
              </Button>
            </div>
          ) : (
            <Badge variant="outline">Pending</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
