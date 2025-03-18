import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CategoryWithQuizCount } from "@/schemas/categorySchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCategoriesWithQuizCount } from "@/app/api/quizzes/category/route";
import { CategoryLink } from "./category-link";

// Client component that receives data
export async function CategoryCardList() {
  const categories: CategoryWithQuizCount[] =
    await getCategoriesWithQuizCount();

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[348px] space-y-2 px-4">
          {categories.map((category) => (
            <div key={category.id}>
              <CategoryLink
                name={category.name}
                slug={category.slug}
                count={category.quizzes_count[0]?.count || 0}
              />
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
