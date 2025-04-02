"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { CheckedState } from "@radix-ui/react-checkbox";

export function TestFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const defaultChecked = searchParams.get("onlyByUser") === "true";

  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams],
  );

  const handleCheck = useDebouncedCallback((value: CheckedState) => {
    const checked = value.valueOf().toString();

    if (checked === "true") {
      params.set("onlyByUser", "true");
    } else {
      params.delete("onlyByUser");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="flex gap-4">
      <SearchInput className="w-max" />
      <div className="flex items-center space-x-2">
        <Checkbox
          id="yours"
          onCheckedChange={handleCheck}
          defaultChecked={defaultChecked}
        />
        <label
          htmlFor="yours"
          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Only yours
        </label>
      </div>
    </div>
  );
}
