import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Skill } from "@/lib/types";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message, success: false, data: null },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data as Skill[],
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
