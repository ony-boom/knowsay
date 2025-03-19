"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizControlButton(props: QuizControlButtonProps) {
  const pathname = usePathname();
  const { currentPage, totalPages, ...rest } = props;
  let newPage = currentPage + (props.direction === "next" ? 1 : -1);
  newPage = Math.min(Math.max(newPage, 1), totalPages);

  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const createPageURL = () => {
    params.set("page", newPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Button {...rest} asChild size="icon" variant="secondary">
      <Link className={cn({
        "pointer-events-none opacity-60": (newPage === currentPage || rest.disabled),
      })} href={createPageURL()}>
        {props.direction === "next" ? <ChevronRight /> : <ChevronLeft />}
      </Link>
    </Button>
  );
}

export type QuizControlButtonProps = React.ComponentProps<typeof Button> & {
  currentPage: number;
  totalPages: number;
  direction: "next" | "prev";
};
