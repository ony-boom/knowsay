import { getAllUsers } from "@/lib/actions/get-users";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ActionColumn from "./users-action-column";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function UsersList() {
  const allUsers = await getAllUsers();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>All Users</CardTitle>
        <CardDescription>
          Manage all users in the system from here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers?.map((user) => {
              // Get initials from full name
              const initials = user.name
                ? user.name
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)
                : "??";

              return (
                <TableRow key={user.clerk_id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.imageUrl} alt={user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">
                      {user.name || "Unnamed"}
                    </span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ActionColumn user={user} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
