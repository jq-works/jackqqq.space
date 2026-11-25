import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { AnalyticsEvent } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, page_path, metadata } = body;

    if (!event_type) {
      return NextResponse.json(
        { error: "event_type is required", success: false, data: null },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("analytics_events")
      .insert([
        {
          event_type,
          page_path: page_path || null,
          metadata: metadata || null,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message, success: false, data: null },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data as AnalyticsEvent[],
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
