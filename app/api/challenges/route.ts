import { supabase } from "@/lib/supabase";
import {
  challengeSchema,
  createChallengeSchema,
} from "@/schemas/challengeSchema";
import { z } from "zod";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .gt("end_time", new Date().toISOString());

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Validate the data against the schema
    const validatedChallenges = z.array(challengeSchema).safeParse(data);
    if (!validatedChallenges.success) {
      return Response.json({ error: "Invalid data format" }, { status: 500 });
    }

    return Response.json(validatedChallenges.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Use the createChallengeSchema for validation
    const result = createChallengeSchema.safeParse(body);
    if (!result.success) {
      return Response.json({ error: result.error.format() }, { status: 400 });
    }

    const { title, description, start_time, end_time, is_team_based } =
      result.data;

    const { data, error } = await supabase.from("challenges").insert([
      {
        title,
        description,
        start_time,
        end_time,
        is_team_based,
        creator_id: body.creator_id || null,
      },
    ]);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    return Response.json(
      { message: "Challenge created successfully", data },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating challenge:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
