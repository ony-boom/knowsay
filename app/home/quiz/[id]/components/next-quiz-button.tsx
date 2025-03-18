"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

export function NextQuizButton(props: NextQuizButtonProps) {
  const pathname = usePathname();
  const { currentPage, totalPages, ...rest } = props;
  const nextPage = currentPage + Number(currentPage !== totalPages);

  const searchParams = useSearchParams();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const createPageURL = () => {
    params.set("page", nextPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Button {...rest} asChild>
      <Link href={createPageURL()}>
        <ChevronRight />
      </Link>
    </Button>
  );
}

export type NextQuizButtonProps = React.ComponentProps<typeof Button> & {
  currentPage: number;
  totalPages: number;
};
