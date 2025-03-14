"use client";

import { usePathname } from "next/navigation";
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
import { Home } from "lucide-react";
import { z } from "zod";
import useSWR from "swr";
import { swrFetcher } from "@/lib/utils";
import { ChallengeSchema } from "@/schemas/challengeSchema";
import { QuizSchema } from "@/schemas/quizSchema";
import { Skeleton } from "@/components/ui/skeleton";

export function HomeBreadcrumb() {
  const pathNames = usePathname().split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathNames.map((pathname, index) => {
          const isLast = index === pathNames.length - 1;
          const isId = z.string().uuid().safeParse(pathname).success;
          const isSpecialPath =
            pathname === "quiz" || pathname === "challenges";
          const href = isSpecialPath
            ? "/home"
            : `/${pathNames.slice(0, index + 1).join("/")}`;

          return (
            <Fragment key={pathname}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={href}>
                    {renderBreadcrumbContent(pathname, isId)}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function renderBreadcrumbContent(pathname: string, isId: boolean) {
  if (pathname === "home") {
    return (
      <Button
        size="icon"
        variant="link"
        className="text-foreground/60 hover:text-foreground cursor-pointer transition-[color]"
      >
        <Home />
      </Button>
    );
  }

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
