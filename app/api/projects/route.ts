import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Project } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured");

    let query = supabase.from("projects").select("*");

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    query = query.order("order_index", { ascending: true });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message, success: false, data: null },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data as Project[],
      error: null,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
        data: null,
      },
      { status: 500 }
    );
  }
}
