import { supabase } from "@/lib/supabase";
import {
  CategoryArraySchema,
  CategoryWithQuizCountArraySchema,
} from "@/schemas/categorySchema";

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
    const { data, error } = await supabase
      .from("categories")
      .select("*, quizzes_count: quizzes(count)");

    console.log("Fetched categories with quiz count:", data);

    if (error) {
      console.error(
        "Error fetching categories with quiz count:",
        error.message,
      );
      return [];
    }

    const validatedData = CategoryWithQuizCountArraySchema.parse(data);

    // Format counts with leading zeros for numbers less than 10
    return validatedData.map((category) => {
      const count = category.quizzes_count[0]?.count || 0;
      return {
        ...category,
        quizzes_count: count < 10 ? `0${count}` : `${count}`,
      };
    });
  } catch (error) {
    console.error("Validation failed:", error);
    throw error;
  }
}
