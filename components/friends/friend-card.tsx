import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FriendWithDetails } from "@/lib/definitions";
import { MessageSquare, MoreHorizontal, UserX } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface FriendCardProps {
  friend: FriendWithDetails;
  onRemove: (friendshipId: string) => Promise<void>;
}

export function FriendCard({ friend, onRemove }: Readonly<FriendCardProps>) {
  const initials = friend.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 relative">
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/home/messages/new?userId=${friend.id}`} className="flex items-center cursor-pointer">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => onRemove(friend.friendship_id)}
              >
                <UserX className="mr-2 h-4 w-4" />
                Remove Friend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={friend.imageUrl} alt={friend.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="mt-2 text-center">
            <h3 className="font-semibold text-lg">{friend.name}</h3>
            <p className="text-sm text-muted-foreground">{friend.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 pt-0 text-center">
        <Badge variant={friend.online ? "success" : "secondary"}>
          {friend.online ? "Online" : "Offline"}
        </Badge>
      </CardContent>
      <CardFooter className="flex justify-center gap-2">
        <Button asChild variant="outline" size="sm" className="gap-2">
          <Link href={`/home/messages/conversation/${friend.id}`}>
            <MessageSquare className="h-4 w-4" />
            Message
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          className="gap-2"
          onClick={() => onRemove(friend.friendship_id)}
        >
          <UserX className="h-4 w-4" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
