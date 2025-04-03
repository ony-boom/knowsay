import { getAllParticipants } from "@/lib/actions/get-users";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default async function UsersList() {
    const allUsers = await getAllParticipants();
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Teams</CardTitle>
                <CardDescription>
                    Manage the teams participating in this challenge.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
                    {allUsers?.map((user) => (
                        <li key={user.clerk_id} className="pb-3 sm:pb-4 flex gap-3">
                            <Avatar>
                                <AvatarImage src={user.imageUrl}></AvatarImage>
                                <AvatarFallback className="w-8 h-8 rounded-full border-2">{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                    {user.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                    {user.email}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
