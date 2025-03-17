import { supabase } from "@/lib/supabase";
import { CategoryArraySchema } from "@/schemas/categorySchema";

export async function GET() {
  try {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Validate the data against the schema
    // ✅ Validate and parse the response using Zod
    const { CategoryArraySchema } = await import("@/schemas/categorySchema");
    const validatedData = CategoryArraySchema.parse(data);

    return Response.json(validatedData, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function getCategoriesWithQuizCount() {
  try {
    // Fetch categories with the count of quizzes
    const { data, error } = await supabase.from("categories").select(`
        id, 
        name, 
        slug, 
        created_at,
        quizzes:quizzes(count)
      `);

    if (error) {
      console.error(
        "Error fetching categories with quiz count:",
        error.message,
      );
      return [];
    }

    const validatedData = CategoryArraySchema.parse(data);

    return validatedData;
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}
