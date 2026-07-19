import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface OpportunityItem {
  id: string;
  labelFa: string;
  labelEn: string;
  descriptionFa: string;
  descriptionEn: string;
  enabled: boolean;
}

export interface OpportunityTemplate {
  key: string;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  defaultItems: OpportunityItem[];
  displayOrder: number;
}

export interface CollaborationOpportunityRecord {
  project_slug: string;
  opportunity_key: string;
  title_fa: string;
  title_en: string;
  subtitle_fa: string;
  subtitle_en: string;
  is_enabled: boolean;
  display_order: number;
  items: unknown;
}

export interface CollaborationOpportunity {
  projectSlug: string;
  key: string;
  titleFa: string;
  titleEn: string;
  subtitleFa: string;
  subtitleEn: string;
  isEnabled: boolean;
  displayOrder: number;
  items: OpportunityItem[];
}

export const OPPORTUNITY_TEMPLATES: OpportunityTemplate[] = [
  {
    key: "biz-dev",
    titleFa: "توسعه کسب‌وکار",
    titleEn: "Business Development",
    subtitleFa: "Business Development",
    subtitleEn: "Business Development",
    displayOrder: 0,
    defaultItems: [
      {
        id: "biz-dev-1",
        labelFa: "جذب مشتری",
        labelEn: "Customer Acquisition",
        descriptionFa: "طراحی و اجرای برنامه‌های جذب مشتری جدید برای بازار هدف.",
        descriptionEn: "Design and execute customer acquisition initiatives for target markets.",
        enabled: true,
      },
      {
        id: "biz-dev-2",
        labelFa: "توسعه بازار",
        labelEn: "Market Development",
        descriptionFa: "شناسایی فرصت‌های توسعه در شهرها و کشور‌های جدید.",
        descriptionEn: "Identify expansion opportunities in new cities and countries.",
        enabled: true,
      },
      {
        id: "biz-dev-3",
        labelFa: "مذاکره با شرکت‌ها",
        labelEn: "Corporate Negotiation",
        descriptionFa: "تعامل و مذاکره با شرکت‌های همکار برای توسعه همکاری.",
        descriptionEn: "Engage and negotiate with partner companies to grow collaborations.",
        enabled: true,
      },
    ],
  },
  {
    key: "sales",
    titleFa: "فروش محصولات",
    titleEn: "Sales Partner",
    subtitleFa: "Sales Partner",
    subtitleEn: "Sales Partner",
    displayOrder: 1,
    defaultItems: [
      {
        id: "sales-1",
        labelFa: "فروش خانه پیش‌ساخته",
        labelEn: "Prefabricated House Sales",
        descriptionFa: "پیگیری سرنخ‌ها و مدیریت فرآیند فروش خانه‌های پیش‌ساخته.",
        descriptionEn: "Manage leads and sales pipeline for prefabricated houses.",
        enabled: true,
      },
      {
        id: "sales-2",
        labelFa: "فروش کابینت",
        labelEn: "Cabinet Sales",
        descriptionFa: "توسعه کانال‌های فروش برای محصولات کابینت و دکوراسیون.",
        descriptionEn: "Develop sales channels for cabinet and interior products.",
        enabled: true,
      },
      {
        id: "sales-3",
        labelFa: "جذب پروژه",
        labelEn: "Project Sourcing",
        descriptionFa: "شناسایی پروژه‌های ساختمانی و معرفی خدمات مجموعه.",
        descriptionEn: "Source construction projects and present company offerings.",
        enabled: true,
      },
    ],
  },
  {
    key: "marketing",
    titleFa: "بازاریابی",
    titleEn: "Marketing",
    subtitleFa: "Marketing",
    subtitleEn: "Marketing",
    displayOrder: 2,
    defaultItems: [
      {
        id: "marketing-1",
        labelFa: "دیجیتال مارکتینگ",
        labelEn: "Digital Marketing",
        descriptionFa: "مدیریت کمپین‌های دیجیتال برای افزایش لید و آگاهی برند.",
        descriptionEn: "Run digital campaigns to increase leads and brand awareness.",
        enabled: true,
      },
      {
        id: "marketing-2",
        labelFa: "تبلیغات",
        labelEn: "Advertising",
        descriptionFa: "برنامه‌ریزی تبلیغات آنلاین و آفلاین با بودجه‌بندی هدفمند.",
        descriptionEn: "Plan online and offline advertising with focused budgeting.",
        enabled: true,
      },
      {
        id: "marketing-3",
        labelFa: "شبکه‌های اجتماعی",
        labelEn: "Social Media",
        descriptionFa: "تولید و مدیریت محتوای شبکه‌های اجتماعی برای رشد تعامل.",
        descriptionEn: "Create and manage social media content to grow engagement.",
        enabled: true,
      },
    ],
  },
  {
    key: "dev",
    titleFa: "توسعه نرم‌افزار",
    titleEn: "Software Development",
    subtitleFa: "Software Development",
    subtitleEn: "Software Development",
    displayOrder: 3,
    defaultItems: [
      {
        id: "dev-1",
        labelFa: "فرانت‌اند",
        labelEn: "Frontend",
        descriptionFa: "پیاده‌سازی رابط کاربری سریع، واکنش‌گرا و کاربرپسند.",
        descriptionEn: "Build fast, responsive, and user-friendly frontend interfaces.",
        enabled: true,
      },
      {
        id: "dev-2",
        labelFa: "بک‌اند",
        labelEn: "Backend",
        descriptionFa: "توسعه API و منطق سمت سرور برای مقیاس‌پذیری محصول.",
        descriptionEn: "Develop backend APIs and services for product scalability.",
        enabled: true,
      },
      {
        id: "dev-3",
        labelFa: "هوش مصنوعی",
        labelEn: "AI Integration",
        descriptionFa: "یکپارچه‌سازی قابلیت‌های AI در جریان‌های اصلی محصول.",
        descriptionEn: "Integrate AI capabilities into core product workflows.",
        enabled: true,
      },
    ],
  },
  {
    key: "biz-partner",
    titleFa: "شریک تجاری",
    titleEn: "Business Partner",
    subtitleFa: "Business Partner",
    subtitleEn: "Business Partner",
    displayOrder: 4,
    defaultItems: [
      {
        id: "biz-partner-1",
        labelFa: "مشارکت در مدیریت",
        labelEn: "Management Participation",
        descriptionFa: "همراهی در تصمیم‌گیری‌های کلان اجرایی و رشد شرکت.",
        descriptionEn: "Contribute to strategic management and growth decisions.",
        enabled: true,
      },
      {
        id: "biz-partner-2",
        labelFa: "توسعه شرکت",
        labelEn: "Company Growth",
        descriptionFa: "تعریف و اجرای برنامه‌های رشد در سطح سازمانی.",
        descriptionEn: "Define and execute company-wide growth initiatives.",
        enabled: true,
      },
      {
        id: "biz-partner-3",
        labelFa: "ایجاد ارتباطات تجاری",
        labelEn: "Business Networking",
        descriptionFa: "توسعه شبکه ارتباطی با شرکا، سرمایه‌گذاران و مشتریان.",
        descriptionEn: "Expand network with partners, investors, and clients.",
        enabled: true,
      },
    ],
  },
];

function parseItems(items: unknown, fallbackItems: OpportunityItem[]): OpportunityItem[] {
  if (!Array.isArray(items)) {
    return fallbackItems;
  }

  const parsed = items
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const data = item as Record<string, unknown>;
      return {
        id: String(data.id || `item-${index + 1}`),
        labelFa: String(data.labelFa || ""),
        labelEn: String(data.labelEn || ""),
        descriptionFa: String(data.descriptionFa || ""),
        descriptionEn: String(data.descriptionEn || ""),
        enabled: Boolean(data.enabled),
      } as OpportunityItem;
    })
    .filter(Boolean) as OpportunityItem[];

  return parsed.length > 0 ? parsed : fallbackItems;
}

export function buildDefaultOpportunities(projectSlug: string): CollaborationOpportunity[] {
  return OPPORTUNITY_TEMPLATES.map((template) => ({
    projectSlug,
    key: template.key,
    titleFa: template.titleFa,
    titleEn: template.titleEn,
    subtitleFa: template.subtitleFa,
    subtitleEn: template.subtitleEn,
    isEnabled: true,
    displayOrder: template.displayOrder,
    items: template.defaultItems,
  }));
}

export async function fetchProjectOpportunities(
  projectSlug: string,
  includeDisabled = false
): Promise<CollaborationOpportunity[]> {
  if (!isSupabaseConfigured || !projectSlug) {
    return buildDefaultOpportunities(projectSlug);
  }

  let query = supabase
    .from("project_collaboration_opportunities")
    .select("project_slug, opportunity_key, title_fa, title_en, subtitle_fa, subtitle_en, is_enabled, display_order, items")
    .eq("project_slug", projectSlug)
    .order("display_order", { ascending: true });

  if (!includeDisabled) {
    query = query.eq("is_enabled", true);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching project collaboration opportunities:", error.message);
    return buildDefaultOpportunities(projectSlug).filter((item) => (includeDisabled ? true : item.isEnabled));
  }

  const rows = (data || []) as CollaborationOpportunityRecord[];
  if (rows.length === 0) {
    return buildDefaultOpportunities(projectSlug).filter((item) => (includeDisabled ? true : item.isEnabled));
  }

  return rows.map((row) => {
    const template = OPPORTUNITY_TEMPLATES.find((item) => item.key === row.opportunity_key);
    const fallbackItems = template?.defaultItems || [];

    return {
      projectSlug: row.project_slug,
      key: row.opportunity_key,
      titleFa: row.title_fa,
      titleEn: row.title_en,
      subtitleFa: row.subtitle_fa,
      subtitleEn: row.subtitle_en,
      isEnabled: row.is_enabled,
      displayOrder: row.display_order,
      items: parseItems(row.items, fallbackItems),
    } as CollaborationOpportunity;
  });
}

export async function saveProjectOpportunities(opportunities: CollaborationOpportunity[]) {
  const payload = opportunities.map((item) => ({
    project_slug: item.projectSlug,
    opportunity_key: item.key,
    title_fa: item.titleFa,
    title_en: item.titleEn,
    subtitle_fa: item.subtitleFa,
    subtitle_en: item.subtitleEn,
    is_enabled: item.isEnabled,
    display_order: item.displayOrder,
    items: item.items,
    updated_at: new Date().toISOString(),
  }));

  return supabase
    .from("project_collaboration_opportunities")
    .upsert(payload, { onConflict: "project_slug,opportunity_key" })
    .select("project_slug, opportunity_key");
}
