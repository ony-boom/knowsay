"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import useSWR from "swr";
import { cn, swrFetcher } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeBreadcrumb() {
  const pathname = usePathname();
  const pathNames = pathname.split("/").filter(Boolean);
  const { back } = useRouter();

  const segments = pathNames.length > 0 ? pathNames.slice(1) : [];
  const isHomePage = pathname === "/home" || pathname === "/home/";

  return (
    <div className="flex flex-col space-y-1">
      <Breadcrumb className="py-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Button
                size="icon"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-8 w-8 rounded-full"
                onClick={back}
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem className={isHomePage ? "font-medium" : ""}>
            <BreadcrumbLink
              asChild
              className={isHomePage ? "pointer-events-none" : ""}
            >
              <Link
                href="/home"
                className={
                  isHomePage
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground transition-colors"
                }
                aria-current={isHomePage ? "page" : undefined}
              >
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const isId = z.string().uuid().safeParse(segment).success;

            const href = `/home/${segments.slice(0, index + 1).join("/")}`;

            return (
              <Fragment key={`${segment}-${index}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem className={isLast ? "font-medium" : ""}>
                  <BreadcrumbLink
                    asChild
                    className={cn(
                      {
                        "pointer-events-none": isLast,
                      },
                      "max-w-18 overflow-hidden md:max-w-max",
                    )}
                  >
                    <Link
                      href={href}
                      className={cn(
                        isLast ? "text-foreground" : "text-muted-foreground",
                        "hover:text-foreground text-nowrap overflow-ellipsis transition-colors",
                      )}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {renderBreadcrumbContent(segment, isId)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function renderBreadcrumbContent(pathname: string, isId: boolean) {
  if (isId) {
    return <IdContent id={pathname} />;
  }

  return <>{pathname.charAt(0).toUpperCase() + pathname.slice(1)}</>;
}

function IdContent({ id }: { id: string }) {
  const pathname = usePathname();

  const pathMapping: Record<string, string> = {
    quiz: "quizzes",
    challenge: "challenges",
    test: "tests",
  };

  const pathType = Object.keys(pathMapping).find((key) =>
    pathname.includes(`/${key}`),
  );
  const apiPath = pathType ? pathMapping[pathType] : "items";

  const { data, isLoading } = useSWR<{ title: string }>(
    `/api/${apiPath}/${id}`,
    swrFetcher,
  );

  if (isLoading) return <Skeleton className="h-4 w-32 animate-pulse" />;

  return data ? (
    <>{data.title ?? "Untitled"}</>
  ) : (
    <span className="text-muted-foreground italic">Untitled</span>
  );
}
