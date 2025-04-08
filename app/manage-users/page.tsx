import UsersList from "@/components/manage-users/users-list";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default function ManageUsers() {
  return (
    <div className="flex flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <hgroup className="space-y-2 md:space-y-4">
          <h1 className="text-2xl font-black md:text-3xl lg:text-5xl">
            Manage Users
          </h1>
          <p className="text-foreground/80 text-base md:text-lg">
            Add, edit, and manage user accounts and permissions
          </p>
        </hgroup>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-start">
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search users by name or email..."
            className="pl-8"
          />
        </div>
      </div>

      {/* Users List Component */}
      <UsersList />
    </div>
  );
}
