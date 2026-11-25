export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string; // see CATEGORY_LABELS in lib/site.ts
  tags: string[];
  thumbnail_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  featured: boolean;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  is_current: boolean;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string;
  category: "competition" | "award" | "publication" | "milestone";
  url: string | null;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "backend" | "tools" | "design";
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price_range: string | null;
  icon_name: string | null;
  order_index: number | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: "page_view" | "cta_click" | "contact_form" | "download";
  page_path: string | null;
  user_id: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}
