import { supabase } from "@/lib/supabase";
import { LogSchema, type Log } from "@/schemas/logSchema";
import { z } from "zod";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) return Response.json({ error: error.message }, { status: 400 });

    // Validate the data against the schema
    const validatedLogs = z.array(LogSchema).safeParse(data);
    if (!validatedLogs.success) {
      return Response.json({ error: "Invalid data format" }, { status: 500 });
    }

    return Response.json(validatedLogs.data, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
