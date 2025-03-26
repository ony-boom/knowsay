"use server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { storeQcmOptionSchema } from "@/schemas/qcmOptionSchema";

export interface QcmOptionState {
  errors?: {
    option_text?: string[];
    option_image_url?: string[];
    is_correct?: string[];
    _form?: string[];
  };
  message?: string;
  success?: boolean;
}

export async function createQcmOption(
  qcmId: string,
  questionId: string,
  quizId: string,
  prevState: QcmOptionState,
  formData: FormData,
): Promise<QcmOptionState> {
  // Extract form data for QCM option
  const optionData = {
    qcm_id: qcmId,
    option_text: (formData.get("option_text") as string) || null,
    option_image_url: (formData.get("option_image_url") as string) || null,
    is_correct: formData.get("is_correct") === "true",
  };

  // Validate QCM option input using Zod schema
  const validatedOption = storeQcmOptionSchema.safeParse(optionData);

  if (!validatedOption.success) {
    return {
      errors: validatedOption.error.flatten().fieldErrors,
      message: "Invalid QCM option data. Please check the form for errors.",
      success: false,
    };
  }

  try {
    // Insert the QCM option
    const { error } = await supabase
      .from("qcm_options")
      .insert(validatedOption.data)
      .select()
      .single();

    if (error) {
      console.error("Failed to create QCM option:", error);
      return {
        message: error.message,
        errors: {
          _form: ["Database error: Failed to create QCM option"],
        },
        success: false,
      };
    }

    // Success - update the UI
    revalidatePath(`/home/quiz/${quizId}/edit/question/${questionId}/edit`);
    return {
      message: "QCM option created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating QCM option:", error);
    return {
      message: "An unexpected error occurred",
      errors: {
        _form: ["Failed to create QCM option. Please try again."],
      },
      success: false,
    };
  }
}

export async function createQcmOptions(
  qcmId: string,
  questionId: string,
  quizId: string,
  prevState: QcmOptionState,
  formData: FormData,
): Promise<QcmOptionState> {
  try {
    // Extract options from FormData
    // FormData would contain indexed fields like option_text_0, option_text_1, etc.
    const options = [];
    const formDataEntries = Array.from(formData.entries());

    // Determine how many options we have by checking option_text_* entries
    const optionIndices = new Set<number>();
    formDataEntries.forEach(([key]) => {
      if (key.startsWith("option_text_")) {
        const index = parseInt(key.split("_").pop() || "");
        if (!isNaN(index)) {
          optionIndices.add(index);
        }
      }
    });

    // Process each option
    for (const index of optionIndices) {
      const option = {
        qcm_id: qcmId,
        option_text: (formData.get(`option_text_${index}`) as string) || null,
        option_image_url:
          (formData.get(`option_image_url_${index}`) as string) || null,
        is_correct: formData.get(`is_correct_${index}`) === "true",
      };
      options.push(option);
    }

    if (options.length === 0) {
      return {
        message: "No options were provided",
        errors: {
          _form: ["At least one option is required"],
        },
        success: false,
      };
    }

    // Validate all options
    for (const option of options) {
      const validatedOption = storeQcmOptionSchema.safeParse(option);
      if (!validatedOption.success) {
        return {
          errors: validatedOption.error.flatten().fieldErrors,
          message: "Invalid QCM option data in batch.",
          success: false,
        };
      }
    }

    // Insert multiple QCM options at once
    const { error } = await supabase
      .from("qcm_options")
      .insert(options)
      .select();

    if (error) {
      console.error("Failed to create QCM options:", error);
      return {
        message: `Database error: ${error.message}`,
        errors: {
          _form: ["Failed to create QCM options in batch."],
        },
        success: false,
      };
    }

    // Success - update the UI
    revalidatePath(`/home/quiz/${quizId}/edit/question/${questionId}/edit`);
    return {
      message: "QCM options created successfully!",
      success: true,
    };
  } catch (error) {
    console.error("Error creating QCM options:", error);
    return {
      message: "An unexpected error occurred while creating QCM options.",
      errors: {
        _form: ["Failed to create QCM options. Please try again."],
      },
      success: false,
    };
  }
}
