"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  createProject,
  deleteProject,
  fetchAllProjectsAdmin,
  getProjectLogoPublicUrl,
  listToMultiline,
  slugifyProjectTitle,
  splitLinesToList,
  type StartupProjectInput,
  type StartupProjectRecord,
  uploadProjectLogo,
  updateProject,
} from "@/lib/projects";
import styles from "./ProjectsAdminPanel.module.css";

interface ProjectsAdminPanelProps {
  locale: "fa" | "en";
}

interface FormState {
  slug: string;
  title: string;
  category: string;
  losStatus: string;
  description: string;
  benefitsText: string;
  sector: string;
  requiredRoles: string;
  showDesignatedOrg: boolean;
  designatedOrgType: string;
  currentPhase: string;
  availableCountries: string;
  logoPath: string;
  websiteUrl: string;
  isPublished: boolean;
  displayOrder: string;
}

const initialForm: FormState = {
  slug: "",
  title: "",
  category: "",
  losStatus: "",
  description: "",
  benefitsText: "",
  sector: "",
  requiredRoles: "",
  showDesignatedOrg: false,
  designatedOrgType: "",
  currentPhase: "",
  availableCountries: "",
  logoPath: "",
  websiteUrl: "",
  isPublished: true,
  displayOrder: "0",
};

export function ProjectsAdminPanel({ locale }: ProjectsAdminPanelProps) {
  const [projects, setProjects] = useState<StartupProjectRecord[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const labels = useMemo(() => {
    if (locale === "fa") {
      return {
        title: "مدیریت پروژه ها",
        subtitle: "ایجاد، ویرایش و انتشار پروژه ها برای نمایش در بخش پروژه ها",
        formTitleCreate: "ایجاد پروژه جدید",
        formTitleEdit: "ویرایش پروژه",
        slug: "شناسه URL (Slug)",
        projectTitle: "عنوان پروژه",
        category: "دسته پروژه",
        losStatus: "وضعیت LOS",
        description: "شرح استارتاپ",
        benefits: "مزایای پیوستن به این تیم (هر مورد در یک خط)",
        sector: "حوزه فعالیت",
        requiredRoles: "نقش های مورد نیاز",
        showDesignatedOrg: "نمایش نوع سازمان حمایتی",
        designatedOrg: "نوع سازمان حمایتی",
        currentPhase: "مراحل طی شده",
        availableCountries: "کشورهای قابل ارائه",
        websiteUrl: "لینک سایت اصلی پروژه",
        logoUpload: "آپلود لوگوی پروژه",
        logoPath: "مسیر لوگو در Storage",
        upload: "آپلود",
        uploading: "در حال آپلود...",
        published: "نمایش عمومی (Published)",
        order: "ترتیب نمایش",
        create: "ایجاد پروژه",
        update: "ذخیره تغییرات",
        reset: "فرم جدید",
        loading: "در حال بارگذاری...",
        noProjects: "هنوز پروژه ای ثبت نشده است.",
        edit: "ویرایش",
        remove: "حذف",
        publishedBadge: "منتشر شده",
        draftBadge: "پیش نویس",
        deleteConfirm: "آیا از حذف این پروژه مطمئن هستید؟",
        invalidWebsite: "لینک سایت باید با http:// یا https:// شروع شود.",
      };
    }

    return {
      title: "Projects Admin",
      subtitle: "Create, edit, and publish projects for the public projects section",
      formTitleCreate: "Create New Project",
      formTitleEdit: "Edit Project",
      slug: "URL Slug",
      projectTitle: "Project Title",
      category: "Project Category",
      losStatus: "LOS Status",
      description: "Startup Description",
      benefits: "Team Benefits (one item per line)",
      sector: "Sector",
      requiredRoles: "Required Roles",
      showDesignatedOrg: "Show Designated Organization Type",
      designatedOrg: "Designated Organization Type",
      currentPhase: "Current Phase",
      availableCountries: "Available Countries",
      websiteUrl: "Project Website URL",
      logoUpload: "Project Logo Upload",
      logoPath: "Logo Path in Storage",
      upload: "Upload",
      uploading: "Uploading...",
      published: "Publicly Visible (Published)",
      order: "Display Order",
      create: "Create Project",
      update: "Save Changes",
      reset: "New Form",
      loading: "Loading...",
      noProjects: "No projects yet.",
      edit: "Edit",
      remove: "Delete",
      publishedBadge: "Published",
      draftBadge: "Draft",
      deleteConfirm: "Are you sure you want to delete this project?",
      invalidWebsite: "Website URL must start with http:// or https://.",
    };
  }, [locale]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError("");
    const data = await fetchAllProjectsAdmin();
    setProjects(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const setFormField = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setNotice("");
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => {
      const shouldAutoSlug = !editingId && (!prev.slug || prev.slug === slugifyProjectTitle(prev.title));
      return {
        ...prev,
        title: value,
        slug: shouldAutoSlug ? slugifyProjectTitle(value) : prev.slug,
      };
    });
  };

  const toPayload = (): StartupProjectInput => {
    const displayOrderNum = Number.parseInt(form.displayOrder, 10);

    return {
      slug: form.slug.trim() || slugifyProjectTitle(form.title),
      title: form.title.trim(),
      category: form.category.trim(),
      los_status: form.losStatus.trim(),
      description: form.description.trim(),
      benefits: splitLinesToList(form.benefitsText),
      sector: form.sector.trim(),
      required_roles: form.requiredRoles.trim(),
      show_designated_org: form.showDesignatedOrg,
      designated_org_type: form.showDesignatedOrg ? form.designatedOrgType.trim() || null : null,
      current_phase: form.currentPhase.trim(),
      available_countries: form.availableCountries.trim(),
      logo_path: form.logoPath.trim() || null,
      website_url: form.websiteUrl.trim() || null,
      is_published: form.isPublished,
      display_order: Number.isFinite(displayOrderNum) ? displayOrderNum : 0,
    };
  };

  const validate = (payload: StartupProjectInput) => {
    if (!payload.title) return "Title is required.";
    if (!payload.slug) return "Slug is required.";
    if (!payload.category || payload.category.length < 2) return "Category is required.";
    if (!payload.los_status) return "LOS status is required.";
    if (!payload.description) return "Description is required.";
    if (!payload.sector) return "Sector is required.";
    if (!payload.required_roles) return "Required roles is required.";
    if (!payload.current_phase) return "Current phase is required.";
    if (!payload.available_countries) return "Available countries is required.";
    if (payload.website_url && !/^https?:\/\//i.test(payload.website_url)) {
      return labels.invalidWebsite;
    }
    if (payload.show_designated_org && !payload.designated_org_type) {
      return "Designated organization type is required when enabled.";
    }
    return "";
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setNotice("");
    setIsUploadingLogo(true);

    const projectSlug = form.slug.trim() || slugifyProjectTitle(form.title);
    if (!projectSlug) {
      setError(locale === "fa" ? "قبل از آپلود لوگو، عنوان پروژه یا slug را وارد کنید." : "Enter a project title or slug before uploading logo.");
      setIsUploadingLogo(false);
      event.target.value = "";
      return;
    }

    const response = await uploadProjectLogo(projectSlug, file);
    if (response.error) {
      setError(response.error.message);
      setIsUploadingLogo(false);
      event.target.value = "";
      return;
    }

    if (response.path) {
      setForm((prev) => ({ ...prev, logoPath: response.path as string }));
      setNotice(locale === "fa" ? "لوگو با موفقیت آپلود شد." : "Logo uploaded successfully.");
    }

    setIsUploadingLogo(false);
    event.target.value = "";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload = toPayload();
    const validationError = validate(payload);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    try {
      const response = editingId
        ? await updateProject(editingId, payload)
        : await createProject(payload);

      if (response.error) {
        setError(response.error.message);
        setIsSaving(false);
        return;
      }

      setNotice(editingId ? "Project updated successfully." : "Project created successfully.");
      resetForm();
      await loadProjects();
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (project: StartupProjectRecord) => {
    setEditingId(project.id);
    setError("");
    setNotice("");
    setForm({
      slug: project.slug,
      title: project.title,
      category: project.category,
      losStatus: project.los_status,
      description: project.description,
      benefitsText: listToMultiline(project.benefits),
      sector: project.sector,
      requiredRoles: project.required_roles,
      showDesignatedOrg: project.show_designated_org,
      designatedOrgType: project.designated_org_type || "",
      currentPhase: project.current_phase,
      availableCountries: project.available_countries,
      logoPath: project.logo_path || "",
      websiteUrl: project.website_url || "",
      isPublished: project.is_published,
      displayOrder: String(project.display_order ?? 0),
    });
  };

  const handleDelete = async (projectId: string) => {
    if (!window.confirm(labels.deleteConfirm)) {
      return;
    }

    setError("");
    setNotice("");
    const response = await deleteProject(projectId);
    if (response.error) {
      setError(response.error.message);
      return;
    }

    if (editingId === projectId) {
      resetForm();
    }

    setNotice("Project deleted.");
    await loadProjects();
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{labels.title}</h2>
        <p>{labels.subtitle}</p>
      </div>

      {notice && <div className={styles.notice}>{notice}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <h3>{editingId ? labels.formTitleEdit : labels.formTitleCreate}</h3>

        <div className={styles.grid}>
          <label>
            <span>{labels.projectTitle}</span>
            <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </label>

          <label>
            <span>{labels.slug}</span>
            <input
              value={form.slug}
              onChange={(e) => setFormField("slug", slugifyProjectTitle(e.target.value))}
              placeholder="eco-track"
              required
            />
          </label>

          <label>
            <span>{labels.category}</span>
            <input
              value={form.category}
              onChange={(e) => setFormField("category", e.target.value)}
              maxLength={80}
              minLength={2}
              required
            />
          </label>

          <label>
            <span>{labels.losStatus}</span>
            <input value={form.losStatus} onChange={(e) => setFormField("losStatus", e.target.value)} required />
          </label>

          <label>
            <span>{labels.sector}</span>
            <input value={form.sector} onChange={(e) => setFormField("sector", e.target.value)} required />
          </label>

          <label>
            <span>{labels.requiredRoles}</span>
            <input value={form.requiredRoles} onChange={(e) => setFormField("requiredRoles", e.target.value)} required />
          </label>

          <label>
            <span>{labels.currentPhase}</span>
            <input value={form.currentPhase} onChange={(e) => setFormField("currentPhase", e.target.value)} required />
          </label>

          <label>
            <span>{labels.availableCountries}</span>
            <input
              value={form.availableCountries}
              onChange={(e) => setFormField("availableCountries", e.target.value)}
              placeholder={locale === "fa" ? "کانادا، امارات، آلمان" : "Canada, UAE, Germany"}
              required
            />
          </label>

          <label>
            <span>{labels.websiteUrl}</span>
            <input
              value={form.websiteUrl}
              onChange={(e) => setFormField("websiteUrl", e.target.value)}
              placeholder="https://example.com"
            />
          </label>

          <label>
            <span>{labels.logoPath}</span>
            <input
              value={form.logoPath}
              onChange={(e) => setFormField("logoPath", e.target.value)}
              placeholder="project-slug/logo-123.png"
            />
          </label>

          <label>
            <span>{labels.order}</span>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setFormField("displayOrder", e.target.value)}
            />
          </label>

          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setFormField("isPublished", e.target.checked)}
            />
            <span>{labels.published}</span>
          </label>

          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              checked={form.showDesignatedOrg}
              onChange={(e) => setFormField("showDesignatedOrg", e.target.checked)}
            />
            <span>{labels.showDesignatedOrg}</span>
          </label>

          {form.showDesignatedOrg && (
            <label>
              <span>{labels.designatedOrg}</span>
              <input
                value={form.designatedOrgType}
                onChange={(e) => setFormField("designatedOrgType", e.target.value)}
                required={form.showDesignatedOrg}
              />
            </label>
          )}
        </div>

        <label>
          <span>{labels.logoUpload}</span>
          <div className={styles.logoUploadRow}>
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} />
            <span>{isUploadingLogo ? labels.uploading : labels.upload}</span>
          </div>
          {form.logoPath && (
            <div className={styles.logoPreviewBox}>
              <img src={getProjectLogoPublicUrl(form.logoPath) || ""} alt="Project logo" className={styles.logoPreviewImage} />
            </div>
          )}
        </label>

        <label>
          <span>{labels.description}</span>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setFormField("description", e.target.value)}
            required
          />
        </label>

        <label>
          <span>{labels.benefits}</span>
          <textarea
            rows={4}
            value={form.benefitsText}
            onChange={(e) => setFormField("benefitsText", e.target.value)}
          />
        </label>

        <div className={styles.actions}>
          <button type="submit" disabled={isSaving} className={styles.primaryBtn}>
            {isSaving ? (locale === "fa" ? "در حال ذخیره..." : "Saving...") : editingId ? labels.update : labels.create}
          </button>
          <button type="button" onClick={resetForm} className={styles.secondaryBtn}>
            {labels.reset}
          </button>
        </div>
      </form>

      <div className={styles.listSection}>
        <h3>{locale === "fa" ? "لیست پروژه ها" : "Projects List"}</h3>
        {isLoading ? (
          <p>{labels.loading}</p>
        ) : projects.length === 0 ? (
          <p>{labels.noProjects}</p>
        ) : (
          <div className={styles.projectList}>
            {projects.map((project) => (
              <article key={project.id} className={styles.projectItem}>
                <div className={styles.projectInfo}>
                  <h4>{project.title}</h4>
                  <p>{project.category}</p>
                  <div className={styles.badges}>
                    <span className={project.is_published ? styles.published : styles.draft}>
                      {project.is_published ? labels.publishedBadge : labels.draftBadge}
                    </span>
                    <span className={styles.slugBadge}>{project.slug}</span>
                  </div>
                </div>
                <div className={styles.projectActions}>
                  <button type="button" onClick={() => handleEdit(project)}>
                    {labels.edit}
                  </button>
                  <button type="button" onClick={() => handleDelete(project.id)} className={styles.deleteBtn}>
                    {labels.remove}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
