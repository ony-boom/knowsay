import { HTMLProps } from "react";
import { cn } from "@/lib/utils";

export function Logo(props: LogoProps) {
  return (
    <span
      {...props}
      className={cn(
        "bg-primary inline-block h-3 w-3 rounded-full",
        props.className,
      )}
    ></span>
  );
}

export type LogoProps = HTMLProps<HTMLSpanElement>;
