import { supabase } from "@/lib/supabase";
import { ChallengeSchema, type Challenge } from "@/schemas/challengeSchema";
import { z } from "zod";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .gt("end_date", new Date().toISOString());

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Validate the data against the schema
    const validatedChallenges = z.array(ChallengeSchema).safeParse(data);
    if (!validatedChallenges.success) {
      return Response.json({ error: "Invalid data format" }, { status: 500 });
    }

    return Response.json(validatedChallenges.data, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Create a submission schema without required fields that DB generates
    const ChallengeSubmissionSchema = ChallengeSchema.omit({
      id: true,
    });

    // Validate the input
    const result = ChallengeSubmissionSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: result.error.format() }, { status: 400 });
    }

    const { title, start_date, end_date, created_by } = result.data;

    const { data, error } = await supabase
      .from("challenges")
      .insert([{ title, start_date, end_date, created_by }]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Challenge created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
