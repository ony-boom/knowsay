import { getAllUsers } from "@/lib/actions/get-users";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import ActionColumn from "./users-action-column";

export default async function UsersList() {
    const allUsers = await getAllUsers();
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                    Manage all users from here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="w-full  divide-y divide-gray-200 dark:divide-gray-700">
                    {allUsers?.map((user) => (
                        <li key={user.clerk_id} className="pb-3 sm:pb-4 flex items-center justify-between">
                            <div className="w-3/4 flex gap-4">
                                <Avatar>
                                    <AvatarImage src={user.imageUrl}></AvatarImage>
                                    <AvatarFallback className="w-8 h-8 rounded-full border-2">{user?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 items-center">
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                        {user.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex-1 w-1/4 justify-end">
                                <ActionColumn user={user}/>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
