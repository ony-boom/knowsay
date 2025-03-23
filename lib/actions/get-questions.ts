"use server";

import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { QuestionArraySchema, QuestionSchema } from "@/schemas/questionSchema";

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
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  // Validate data against schema
  const validatedData = QuestionSchema.parse(data);
  if (!validatedData) {
    throw new Error("Invalid data returned from database");
  }

  return validatedData;
}

export async function getQuestionsByQuiz(quizId: string) {
  try {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    // Fetch questions ordered by order_position
    const { data: questions, error } = await supabase
      .from("questions")
      .select("id, content, type, order_position, created_at, quiz_id")
      .eq("quiz_id", quizId)
      .order("order_position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const validatedData = QuestionArraySchema.parse(questions);

    return validatedData;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
