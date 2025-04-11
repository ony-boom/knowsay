"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ComponentProps } from "react";
import useSWR from "swr";
import { getAllCorrectors } from "@/lib/actions/get-users";
import { Skeleton } from "@/components/ui/skeleton";
import { CorrectorSelectItem } from "./test-corrector-select-item";
import { useUser } from "@clerk/nextjs";
import { getCurrentUserId } from "@/lib/actions/get-user";

export function TestCorrectorSelect(props: TestCorrectorSelectProps) {
  const { data, isLoading, error } = useSWR("allUsers", getAllCorrectors);
  const { data: userId } = useSWR("currentUserId", getCurrentUserId);
  const { user: clerkUser } = useUser();

  if (isLoading || !data) {
    return <Skeleton className="h-4" />;
  }

  if (error) {
    return null;
  }

  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Choose a corrector" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem key={userId} value={userId}>Correct yourself</SelectItem>

        {data
          .filter((user) => user.clerk_id != clerkUser?.id)
          .map((user) => {
            return <CorrectorSelectItem key={user.id} user={user} />;
          })}
      </SelectContent>
    </Select>
  );
}

export type TestCorrectorSelectProps = ComponentProps<typeof Select> & {};
