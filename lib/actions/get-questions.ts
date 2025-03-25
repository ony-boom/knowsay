"use server";

import { supabase } from "@/lib/supabase";

export async function getQuestions(
  quizId: string,
  page = 1,
  pageSize = 10,
  paginate = true,
) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  let query = supabase
    .from("quiz_questions")
    .select(
      `
        questions:qcm_id(*)
      `,
    )
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });
  if (paginate) {
    query = query.range(start, end);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    questions: data,
    totalCount: count || 0,
  };
}

export async function getQuestion(id: string) {
  const { data, error } = await supabase
    .from("qcm")
    .select("*")
    .eq("qcm_id", id)
    .single();

  if (error) throw new Error(error.message);

  // No need for schema validation if we're just returning the raw data
  // If you want to add validation, define the schema first
  return data;
}

export async function getQuestionsByQuiz(quizId: string) {
  try {
    if (!quizId) {
      throw new Error("Quiz ID is required");
    }

    // Fetch questions using the quiz_questions join table approach like in getQuestions
    const { data, error } = await supabase
      .from("quiz_questions")
      .select(
        `
        questions:qcm_id(id, content, type, order_position, created_at, quiz_id)
      `,
      )
      .eq("quiz_id", quizId)
      .order("position", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    // Extract the questions from the nested structure
    const questions = data?.map((item) => item.questions) || [];

    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
