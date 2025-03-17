"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";

type CategoryLinkProps = {
  name: string;
  slug: string;
  count: number;
};

export const CategoryLink = ({ name, slug, count }: CategoryLinkProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get("category");
  const isActive = currentCategory === slug;

  const createCategoryUrl = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", slug);
    params.set("page", "1");

    return `${pathname}?${params.toString()}`;
  };

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`h-auto w-full justify-between px-3 py-2 text-left text-sm transition-all ${
        isActive ? "font-medium shadow-sm" : "hover:bg-muted/50"
      }`}
      asChild
    >
      <Link href={createCategoryUrl(slug)}>
        <span className="flex items-center gap-2">
          {isActive && (
            <span className="bg-primary/70 h-1.5 w-1.5 animate-pulse rounded-full" />
          )}
          {name}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            isActive
              ? "bg-primary/5 text-primary/80"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {count || 0}
        </span>
      </Link>
    </Button>
  );
};
