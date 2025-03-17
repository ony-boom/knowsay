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
import { swrFetcher } from "@/lib/utils";
import { ChallengeSchema } from "@/schemas/challengeSchema";
import { QuizSchema } from "@/schemas/quizSchema";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeBreadcrumb() {
  const pathNames = usePathname().split("/").filter(Boolean);
  const { back } = useRouter();

  const segments = pathNames.length > 0 ? pathNames.slice(1) : [];

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

          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/home" className="text-foreground font-medium">
                Home
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const isId = z.string().uuid().safeParse(segment).success;
            const isSpecialPath =
              segment === "quiz" || segment === "challenges";

            // Build the href based on the current position in the path
            const href = isSpecialPath
              ? "/home"
              : `/home/${segments.slice(0, index + 1).join("/")}`;

            return (
              <Fragment key={`${segment}-${index}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem className={isLast ? "font-medium" : ""}>
                  <BreadcrumbLink
                    asChild
                    className={isLast ? "pointer-events-none" : ""}
                  >
                    <Link
                      href={href}
                      className={
                        isLast
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground transition-colors"
                      }
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
  const isQuizPath = pathname.includes("/quiz");
  const path = isQuizPath ? "quizzes" : "challenges";

  const { data, isLoading } = useSWR<
    z.infer<typeof ChallengeSchema> | z.infer<typeof QuizSchema>
  >(`/api/${path}/${id}`, swrFetcher);

  if (isLoading) return <Skeleton className="h-4 w-32" />;

  return data ? <>{data.title}</> : null;
}
