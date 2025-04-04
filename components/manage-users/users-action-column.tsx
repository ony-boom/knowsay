"use client"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { updateUserRole } from "@/lib/actions/update-user-role";

export default function ActionColumn({ user }: Readonly<{ user: User }>) {
    const t = useTranslations("usersMangement");
    const roleList: User["role"][] = ["corrector", "super_admin", "user"];
    const [currentRole, setCurrentRole] = useState<User["role"]>(user.role);
    const handleRoleChanged = async (clerk_id: string, role: User["role"]) => {
        await updateUserRole(clerk_id, role);
        setCurrentRole(role)
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-56">
                    {t(`role.${user.role}`)}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {roleList.filter((role) => role !== currentRole).map((role) => (
                    <DropdownMenuItem key={role} onClick={async () => await handleRoleChanged(user.clerk_id, role)}>{t(`role.${role}`)}</DropdownMenuItem>
                ))}
                <DropdownMenuItem className="text-destructive">
                    Delete Team
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}