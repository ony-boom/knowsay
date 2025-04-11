"use client";

import { ComponentProps } from "react";
import { SelectItem } from "@/components/ui/select";
import { User } from "@/lib/definitions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const CorrectorSelectItem = (props: Omit<ComponentProps<typeof SelectItem>, "value"> & {
  user: User;
}) => {
  const { user, ...selectProps } = props;

  const initials =
    user.name
      ?.split(" ")
      .map((name) => name[0]?.toUpperCase())
      .join("") || "";

  return (
    <SelectItem {...selectProps} value={user.id!}>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{user.name || "Unnamed"}</span>
      </div>
    </SelectItem>
  );
};
