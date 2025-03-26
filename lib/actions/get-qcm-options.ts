"use server";

import { supabase } from "@/lib/supabase";
import {
  qcmOptionsArraySchema,
  qcmOptionSchema,
} from "@/schemas/qcmOptionSchema";

/**
 * Get all options for a specific QCM
 */
export async function getQcmOptions(qcmId: string) {
  try {
    if (!qcmId) {
      throw new Error("QCM ID is required");
    }

    const { data, error } = await supabase
      .from("qcm_options")
      .select("*")
      .eq("qcm_id", qcmId)
      .order("option_id");

    if (error) {
      throw new Error(error.message);
    }

    // Validate data against schema
    const validatedData = qcmOptionsArraySchema.safeParse(data);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching QCM options:", error);
    return [];
  }
}

/**
 * Get a single QCM option by its ID
 */
export async function getQcmOption(optionId: string) {
  try {
    if (!optionId) {
      throw new Error("Option ID is required");
    }

    const { data, error } = await supabase
      .from("qcm_options")
      .select("*")
      .eq("option_id", optionId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Validate data against schema
    const validatedData = qcmOptionSchema.safeParse(data);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching QCM option:", error);
    throw error;
  }
}

/**
 * Get all correct options for a specific QCM
 */
export async function getCorrectQcmOptions(qcmId: string) {
  try {
    if (!qcmId) {
      throw new Error("QCM ID is required");
    }

    const { data, error } = await supabase
      .from("qcm_options")
      .select("*")
      .eq("qcm_id", qcmId)
      .eq("is_correct", true);

    if (error) {
      throw new Error(error.message);
    }

    // Validate data against schema
    const validatedData = qcmOptionsArraySchema.safeParse(data);
    if (!validatedData.success) {
      console.error("Validation error:", validatedData.error);
      throw new Error("Invalid data returned from database");
    }

    return validatedData.data;
  } catch (error) {
    console.error("Error fetching correct QCM options:", error);
    return [];
  }
}
