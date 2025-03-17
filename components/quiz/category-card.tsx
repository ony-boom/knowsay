import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";

export const CategoryCard = () => {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {[
            "General Knowledge",
            "Science",
            "History",
            "Geography",
            "Entertainment",
            "Sports",
            "Technology",
          ].map((category) => (
            <li key={category}>
              <Button
                variant="ghost"
                className="h-auto w-full justify-between px-2 py-1 text-left text-sm"
              >
                {category}
                <span className="text-muted-foreground bg-muted rounded-full px-2 py-0.5 text-xs">
                  {Math.floor(Math.random() * 20) + 1}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
