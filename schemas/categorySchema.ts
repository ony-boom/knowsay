import { z } from "zod";

// Define the schema for a single category
export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Category name must have at least 2 characters"),
  slug: z.string().min(2, "Slug must have at least 2 characters"),
  created_at: z.string(),
});

// Define an array schema for multiple categories
export const CategoryArraySchema = z.array(CategorySchema);

// Infer TypeScript types from Zod schema
export type Category = z.infer<typeof CategorySchema>;
