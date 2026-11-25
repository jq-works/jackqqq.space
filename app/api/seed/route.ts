import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Only available in development
const SEED_PASSWORD = process.env.NEXT_PUBLIC_SEED_PASSWORD || "dev-seed-123";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Simple auth check
    if (body.password !== SEED_PASSWORD) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials", success: false },
        { status: 500 }
      );
    }

    const client = createClient(url, serviceKey);

    // Insert projects
    const { error: projectsError } = await client
      .from("projects")
      .insert([
        { title: "OneLensMedia", slug: "onelens-media", description: "Website media live streaming dan produksi visual.", category: "live-streaming", tags: ["Next.js", "OBS", "Multi-cam"], featured: true, order_index: 1 },
        { title: "Crew Live Streaming Event", slug: "live-streaming-crew", description: "Crew live streaming untuk acara sekolah dan komunitas.", category: "live-streaming", tags: ["OBS", "vMix", "Switcher"], featured: true, order_index: 2 },
        { title: "Motion Bumper", slug: "motion-bumper", description: "Bumper dan opening motion graphic untuk event.", category: "motion-graphics", tags: ["After Effects", "Premiere"], featured: true, order_index: 3 },
        { title: "Kepanitiaan Event", slug: "event-committee", description: "Koordinasi dan produksi acara bersama panitia.", category: "event-committee", tags: ["Koordinasi", "Produksi"], featured: false, order_index: 4 },
        { title: "Dokumentasi Fotografi", slug: "photography", description: "Dokumentasi foto acara dan potret.", category: "photography", tags: ["Lightroom", "Photoshop"], featured: false, order_index: 5 },
        { title: "Videografi & Editing", slug: "videography", description: "Video promo, aftermovie, dan dokumentasi.", category: "videography", tags: ["Premiere", "DaVinci"], featured: false, order_index: 6 },
        { title: "Admin Dashboard Fintech", slug: "fintech-dashboard", description: "Dashboard admin untuk monitoring transaksi dan analytics.", category: "web-app", tags: ["React", "TypeScript", "Recharts"], featured: false, order_index: 7 },
      ]);

    if (projectsError) throw projectsError;

    // Insert skills
    const { error: skillsError } = await client.from("skills").insert([
      { name: "Next.js", category: "frontend", proficiency: "expert", order_index: 1 },
      { name: "React", category: "frontend", proficiency: "expert", order_index: 2 },
      { name: "TypeScript", category: "frontend", proficiency: "advanced", order_index: 3 },
      { name: "Tailwind CSS", category: "frontend", proficiency: "expert", order_index: 4 },
      { name: "Framer Motion", category: "frontend", proficiency: "advanced", order_index: 5 },
      { name: "Node.js", category: "backend", proficiency: "advanced", order_index: 6 },
      { name: "Supabase", category: "backend", proficiency: "advanced", order_index: 7 },
      { name: "PostgreSQL", category: "backend", proficiency: "intermediate", order_index: 8 },
      { name: "Figma", category: "design", proficiency: "advanced", order_index: 9 },
      { name: "Git", category: "tools", proficiency: "expert", order_index: 10 },
      { name: "OBS / Live Switcher", category: "multimedia", proficiency: "advanced", order_index: 11 },
      { name: "Premiere Pro", category: "multimedia", proficiency: "advanced", order_index: 12 },
      { name: "After Effects", category: "multimedia", proficiency: "intermediate", order_index: 13 },
      { name: "Fotografi & Lightroom", category: "multimedia", proficiency: "advanced", order_index: 14 },
    ]);

    if (skillsError) throw skillsError;

    // Insert services
    const { error: servicesError } = await client.from("services").insert([
      {
        title: "Landing Page",
        description:
          "Website landing page yang cepat dan dioptimasi untuk konversi. Termasuk design, development, dan deployment.",
        price_range: "5jt-10jt",
        icon_name: "globe",
        order_index: 1,
      },
      {
        title: "Web Application",
        description:
          "Aplikasi web custom dengan backend, database, dan real-time features. Scalable dan production-ready.",
        price_range: "20jt-50jt",
        icon_name: "layers",
        order_index: 2,
      },
      {
        title: "Website Maintenance",
        description:
          "Support dan maintenance untuk website/aplikasi existing. Update, bugfix, dan feature additions.",
        price_range: "custom",
        icon_name: "wrench",
        order_index: 3,
      },
    ]);

    if (servicesError) throw servicesError;

    // Insert education
    const { error: educationError } = await client.from("education").insert([
      {
        school: "SMK Telkom Malang",
        degree: "RPL",
        field: "Software Development",
        start_date: "2022-01-01",
        end_date: "2025-06-30",
        description: "Juara Hackathon, ASEAN Scholar",
        is_current: true,
        order_index: 1,
      },
      {
        school: "BINUS University",
        degree: "S1 Computer Science",
        field: "Software Engineering",
        start_date: "2025-08-01",
        end_date: null,
        description: "BINUS Scholarship recipient",
        is_current: true,
        order_index: 2,
      },
    ]);

    if (educationError) throw educationError;

    // Insert achievements
    const { error: achievementsError } = await client
      .from("achievements")
      .insert([
        {
          title: "ASEAN Hackathon Winner",
          description:
            "Juara hackathon level ASEAN dengan project OneLensMedia",
          date: "2024-09-15",
          category: "competition",
          url: "https://asean-hackathon.example.com",
          order_index: 1,
        },
        {
          title: "BINUS Full Scholarship",
          description:
            "Penerima beasiswa penuh program S1 Computer Science di BINUS University",
          date: "2025-06-01",
          category: "award",
          url: "https://binus.ac.id",
          order_index: 2,
        },
        {
          title: "Freelance 5+ Projects",
          description:
            "Sukses menyelesaikan 5+ project freelance dengan client satisfaction 100%",
          date: "2024-12-01",
          category: "milestone",
          url: null,
          order_index: 3,
        },
      ]);

    if (achievementsError) throw achievementsError;

    return NextResponse.json({
      success: true,
      message: "Seed data inserted successfully",
      counts: {
        projects: 3,
        skills: 10,
        services: 3,
        education: 2,
        achievements: 3,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}
