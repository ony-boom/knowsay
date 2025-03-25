import { Category } from "@/schemas/categorySchema";
import { supabase } from "../supabase";

export async function createCategory(
  categoryData: Omit<Category, "created_at" | "id">,
) {
  return supabase.from("categories").insert(categoryData);
}
