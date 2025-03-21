import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const circularProgressVariants = cva(
  "relative inline-flex items-center justify-center",
  {
    variants: {
      size: {
        xs: "h-9 w-9",
        sm: "h-16 w-16",
        md: "h-24 w-24",
        lg: "h-32 w-32",
      },
      variant: {
        default: "text-primary",
        secondary: "text-secondary",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants> {
  value?: number;
  max?: number;
  thickness?: number;
  children?: React.ReactNode;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      className,
      value = 0,
      max = 100,
      thickness = 4,
      size,
      variant,
      children,
      ...props
    },
    ref,
  ) => {
    const percentage = (Math.min(Math.max(0, value), max) / max) * 100;
    const svgSize = 100;
    const radius = svgSize / 2 - thickness * 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div
        className={cn(circularProgressVariants({ size, variant }), className)}
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        {...props}
      >
        <svg
          className="h-full w-full -rotate-90"
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="stroke-muted"
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
          />
          <circle
            className={cn(
              "transition-all duration-300 ease-in-out",
              variant === "default" && "stroke-primary",
              variant === "secondary" && "stroke-secondary",
              variant === "destructive" && "stroke-destructive",
            )}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {children && (
          <div className="text-foreground absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                "font-medium",
                size === "xs" && "text-xs",
                size === "sm" && "text-sm",
                size === "md" && "text-lg",
                size === "lg" && "text-xl",
              )}
            >
              {children}
            </span>
          </div>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = "CircularProgress";

export { CircularProgress };
