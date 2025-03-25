import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CategoryLink } from "./category-link";
import { ClearCategoryFilter } from "./clear-category-filter";
import { getCategoriesWithQuizCount } from "@/lib/actions/get-categories";

// Client component that receives data
export async function CategoryCardList() {
  const categories = await getCategoriesWithQuizCount();

  return (
    <Card className="gap-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <ClearCategoryFilter />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[348px] space-y-2 px-4 pb-4">
          {categories
            ?.filter((quiz) => quiz.quizzes_count[0]?.count > 0)
            .map((category) => (
              <div key={category.id} className="mt-1">
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
