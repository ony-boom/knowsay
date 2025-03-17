import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { getCategoriesWithQuizCount } from "@/app/api/quizzes/category/route";
import { Category } from "@/schemas/categorySchema";

interface CategoryWithQuizCount extends Category {
  quiz_count?: number;
}

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
      <CardContent>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Button
                variant="ghost"
                className="h-auto w-full justify-between px-2 py-1 text-left text-sm"
              >
                {category.name}
                <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                  {category.quiz_count || 0}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Server component that fetches data
export async function CategoryCard() {
  const categories = await getCategoriesWithQuizCount();

  return <CategoryCardList categories={categories} />;
}
