"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "./ui/input";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export const SearchInput = ({
  className: containerClassName,
  inputProps,
  ...rest
}: SearchInputProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const handleSearch = useDebouncedCallback(function handleSearch(
    term: string,
  ) {
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 250);

  return (
    <div className={cn(containerClassName, "relative")} {...rest}>
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        {...inputProps}
        type="search"
        placeholder="Search..."
        className={cn("pl-8", inputProps?.className)}
        defaultValue={searchParams.get("query")?.toString()}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
};

export type SearchInputProps = React.ComponentProps<"div"> & {
  inputProps?: React.ComponentProps<typeof Input>;
};
