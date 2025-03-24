"use server";

import { supabase } from "@/lib/supabase";

export async function updateQuestionOrder(
  questionId: string,
  newPosition: number,
) {
  try {
    // Fetch the current question's quiz_id
    const { data: question, error: fetchError } = await supabase
      .from("questions")
      .select("quiz_id, order_position")
      .eq("id", questionId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    // Fetch all questions for the quiz in order
    const { data: questions, error: listError } = await supabase
      .from("questions")
      .select("id, order_position")
      .eq("quiz_id", question.quiz_id)
      .order("order_position");

    if (listError) throw new Error(listError.message);

    // Find the question being moved
    const movingQuestion = questions.find((q) => q.id === questionId);
    if (!movingQuestion) throw new Error("Question not found");

    // Remove it from the list and reinsert at new position
    const reorderedQuestions = questions
      .filter((q) => q.id !== questionId)
      .splice(newPosition - 1, 0, movingQuestion);

    // Bulk update all order positions
    const updates = reorderedQuestions.map((q, index) => ({
      id: q.id,
      order_position: index + 1,
    }));

    for (const update of updates) {
      await supabase
        .from("questions")
        .update({ order_position: update.order_position })
        .eq("id", update.id);
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error };
  }
}
