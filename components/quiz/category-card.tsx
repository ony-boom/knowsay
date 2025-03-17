import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { CategoryWithQuizCount } from "@/schemas/categorySchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

interface CategoryCardProps {
  categories: CategoryWithQuizCount[];
}

// Client component that receives data
export function CategoryCardList({ categories }: CategoryCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[348px] space-y-2 px-4">
          {categories.map((category) => (
            <div key={category.id}>
              <Button
                variant="ghost"
                className="h-auto w-full justify-between px-2 py-1 text-left text-sm"
                asChild
              >
                <Link href={`/category/${category.slug}`}>
                  {category.name}
                  <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                    {category.quizzes_count[0].count || 0}
                  </span>
                </Link>
              </Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
