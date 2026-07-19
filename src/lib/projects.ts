import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export interface StartupProjectRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  los_status: string;
  description: string;
  benefits: string[] | null;
  sector: string;
  required_roles: string;
  show_designated_org: boolean;
  designated_org_type: string | null;
  current_phase: string;
  available_countries: string;
  logo_path: string | null;
  website_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface StartupProjectInput {
  slug: string;
  title: string;
  category: string;
  los_status: string;
  description: string;
  benefits: string[];
  sector: string;
  required_roles: string;
  show_designated_org: boolean;
  designated_org_type: string | null;
  current_phase: string;
  available_countries: string;
  logo_path: string | null;
  website_url: string | null;
  is_published: boolean;
  display_order: number;
}

const PROJECT_LOGO_BUCKET = "project-assets";

export function slugifyProjectTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function splitLinesToList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function listToMultiline(value: string[] | null | undefined): string {
  if (!value || value.length === 0) {
    return "";
  }
  return value.join("\n");
}

export function getProjectLogoPublicUrl(logoPath: string | null | undefined): string | null {
  if (!logoPath) {
    return null;
  }

  const { data } = supabase.storage.from(PROJECT_LOGO_BUCKET).getPublicUrl(logoPath);
  return data.publicUrl || null;
}

export async function uploadProjectLogo(projectSlug: string, file: File) {
  const safeSlug = (projectSlug || "project")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");
  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const objectPath = `${safeSlug}/logo-${Date.now()}.${ext}`;

  const uploadResult = await supabase.storage
    .from(PROJECT_LOGO_BUCKET)
    .upload(objectPath, file, { cacheControl: "3600", upsert: true });

  if (uploadResult.error) {
    return {
      error: uploadResult.error,
      path: null,
      publicUrl: null,
    };
  }

  return {
    error: null,
    path: uploadResult.data.path,
    publicUrl: getProjectLogoPublicUrl(uploadResult.data.path),
  };
}

export async function fetchPublishedProjects(): Promise<StartupProjectRecord[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from("startup_projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching published projects:", error.message);
    return [];
  }

  return (data || []) as StartupProjectRecord[];
}

export async function fetchAllProjectsAdmin(): Promise<StartupProjectRecord[]> {
  if (!isSupabaseConfigured) {
    return [];
  }

  const { data, error } = await supabase
    .from("startup_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin projects:", error.message);
    return [];
  }

  return (data || []) as StartupProjectRecord[];
}

export async function createProject(input: StartupProjectInput) {
  return supabase.from("startup_projects").insert(input).select("*").single();
}

export async function updateProject(projectId: string, input: StartupProjectInput) {
  return supabase
    .from("startup_projects")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select("*")
    .single();
}

export async function deleteProject(projectId: string) {
  return supabase.from("startup_projects").delete().eq("id", projectId);
}
