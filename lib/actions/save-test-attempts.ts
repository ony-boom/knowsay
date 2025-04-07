"use server";

import { supabase } from "../supabase";
import { getCurrentUserId } from "./get-user";

export async function saveTestAttempts({
  testId,
  answers,
}: SaveTestAttemptsParams) {
  try {
    const userId = await getCurrentUserId();

    const { data: testAttempt, error } = await supabase
      .from("test_attempts")
      .insert({
        test_id: testId,
        user_id: userId,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error saving test attempt:", error);
      return false;
    }

    const results = await Promise.all(
      answers.map(async (answer) => {
        const freeTextAnswer = answer.isFreeText ? answer.answer : null;
        const selectedOption = answer.isFreeText ? null : [answer.answer];

        const { error } = await supabase.from("test_attempt_answers").insert({
          test_attempt_id: testAttempt.id,
          question_id: answer.questionId,
          free_text_answer: freeTextAnswer,
          selected_options: selectedOption,
        });

        if (error) {
          console.error("Error saving test attempt answer:", error);
          return false;
        }
        return true;
      }),
    );

    return results.every((result) => result);
  } catch (error) {
    console.error("Error saving test attempts:", error);
    return false;
  }
}

type SaveTestAttemptsParams = {
  testId: string;
  answers: {
    questionId: string;
    answer: string;
    isFreeText: boolean;
  }[];
};
