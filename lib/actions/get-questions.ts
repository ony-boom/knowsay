"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { QuestionSchema } from "@/schemas/questionSchema";

export async function getQuestions(
  quizId: string,
  page = 1,
  pageSize = 10,
  paginate = true,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from("questions")
    .select("*", { count: "exact" })
    .eq("quiz_id", quizId)
    .order("created_at", { ascending: true });

  if (paginate) {
    query = query.range(start, end);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = z.array(QuestionSchema).safeParse(data);
  if (!validatedData.success) {
    console.log(data);
    console.log(validatedData.error);

    throw new Error("Invalid data returned from database");
  }

  return {
    questions: validatedData.data,
    totalCount: count || 0,
  };
}

export async function getQuestion(id: string) {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("id", id);

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = QuestionSchema.safeParse(data);
  if (!validatedData.success) {
    throw new Error("Invalid data returned from database");
  }

  return validatedData.data;
}
