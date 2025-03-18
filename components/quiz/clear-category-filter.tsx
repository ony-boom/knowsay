// Client component to clear the category filter
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";

export function ClearCategoryFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentCategory = searchParams.get("category");
  const { replace } = useRouter();

  if (!currentCategory) return null;

  const clearCategory = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.delete("category");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={clearCategory}
      className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
    >
      Clear
    </Button>
  );
}
