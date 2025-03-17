import { z } from "zod";

// Define the schema for a single category
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Category name must have at least 2 characters"),
  slug: z.string().min(2, "Slug must have at least 2 characters"),
  created_at: z.string(),
});

export const CategoryWithQuizCountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Category name must have at least 2 characters"),
  slug: z.string().min(2, "Slug must have at least 2 characters"),
  created_at: z.string(),
  quizzes_count: z.array(
    z.object({
      count: z.number().int(),
    }),
  ),
});

// Define an array schema for multiple categories
export const CategoryArraySchema = z.array(CategorySchema);

export const CategoryWithQuizCountArraySchema = z.array(
  CategoryWithQuizCountSchema,
);

// Infer TypeScript types from Zod schema
export type Category = z.infer<typeof CategorySchema>;

export type CategoryWithQuizCount = z.infer<typeof CategoryWithQuizCountSchema>;
