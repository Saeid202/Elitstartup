"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  buildDefaultOpportunities,
  fetchProjectOpportunities,
  saveProjectOpportunities,
  type CollaborationOpportunity,
  type OpportunityItem,
} from "@/lib/collaborationOpportunities";
import { fetchAllProjectsAdmin } from "@/lib/projects";
import styles from "./CollaborationOpportunitiesAdminPanel.module.css";

interface ProjectOption {
  slug: string;
  title: string;
}

interface CollaborationOpportunitiesAdminPanelProps {
  locale: "fa" | "en";
}

function createNewItem(index: number): OpportunityItem {
  return {
    id: `custom-${Date.now()}-${index}`,
    labelFa: "",
    labelEn: "",
    descriptionFa: "",
    descriptionEn: "",
    enabled: true,
  };
}

export function CollaborationOpportunitiesAdminPanel({ locale }: CollaborationOpportunitiesAdminPanelProps) {
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState("");
  const [opportunities, setOpportunities] = useState<CollaborationOpportunity[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingOpportunities, setIsLoadingOpportunities] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const labels = useMemo(() => {
    if (locale === "fa") {
      return {
        title: "مدیریت فرصت‌های همکاری",
        subtitle: "برای هر پروژه، ۵ کارت فرصت همکاری را فعال/غیرفعال کنید و موارد و توضیحات هر کارت را بنویسید.",
        project: "پروژه",
        projectPlaceholder: "یک پروژه انتخاب کنید",
        loadingProjects: "در حال بارگذاری پروژه‌ها...",
        loadingOpportunities: "در حال بارگذاری فرصت‌ها...",
        saveAll: "ذخیره همه تغییرات",
        resetDefaults: "بازگردانی پیش‌فرض ۵ کارت",
        addItem: "افزودن مورد جدید",
        removeItem: "حذف مورد",
        enabledCard: "فعال بودن کارت",
        enabledItem: "فعال بودن مورد",
        titleFa: "عنوان فارسی کارت",
        titleEn: "عنوان انگلیسی کارت",
        subtitleFa: "زیرعنوان فارسی",
        subtitleEn: "زیرعنوان انگلیسی",
        itemLabelFa: "عنوان مورد (فارسی)",
        itemLabelEn: "عنوان مورد (انگلیسی)",
        itemDescFa: "توضیحات مورد (فارسی)",
        itemDescEn: "توضیحات مورد (انگلیسی)",
        emptyProjects: "پروژه‌ای برای مدیریت پیدا نشد.",
      };
    }

    return {
      title: "Collaboration Opportunities Admin",
      subtitle: "For each project, enable/disable the 5 opportunity cards and define itemized activities and descriptions.",
      project: "Project",
      projectPlaceholder: "Select a project",
      loadingProjects: "Loading projects...",
      loadingOpportunities: "Loading opportunities...",
      saveAll: "Save All Changes",
      resetDefaults: "Reset 5-Card Defaults",
      addItem: "Add New Item",
      removeItem: "Remove Item",
      enabledCard: "Card Enabled",
      enabledItem: "Item Enabled",
      titleFa: "Card Title (FA)",
      titleEn: "Card Title (EN)",
      subtitleFa: "Subtitle (FA)",
      subtitleEn: "Subtitle (EN)",
      itemLabelFa: "Item Label (FA)",
      itemLabelEn: "Item Label (EN)",
      itemDescFa: "Item Description (FA)",
      itemDescEn: "Item Description (EN)",
      emptyProjects: "No projects found for management.",
    };
  }, [locale]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    setError("");
    const data = await fetchAllProjectsAdmin();

    const mapped = data.map((project) => ({
      slug: project.slug,
      title: project.title,
    }));

    setProjects(mapped);
    if (mapped.length > 0) {
      setSelectedProjectSlug((prev) => prev || mapped[0].slug);
    }
    setIsLoadingProjects(false);
  };

  const loadOpportunities = async (projectSlug: string) => {
    if (!projectSlug) {
      return;
    }

    setIsLoadingOpportunities(true);
    setError("");
    setNotice("");

    const data = await fetchProjectOpportunities(projectSlug, true);
    const completeData = data.length > 0 ? data : buildDefaultOpportunities(projectSlug);
    setOpportunities(completeData);
    setIsLoadingOpportunities(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectSlug) {
      loadOpportunities(selectedProjectSlug);
    }
  }, [selectedProjectSlug]);

  const updateOpportunity = (
    opportunityKey: string,
    updater: (opportunity: CollaborationOpportunity) => CollaborationOpportunity
  ) => {
    setOpportunities((prev) => prev.map((item) => (item.key === opportunityKey ? updater(item) : item)));
  };

  const updateItem = (
    opportunityKey: string,
    itemId: string,
    updater: (item: OpportunityItem) => OpportunityItem
  ) => {
    updateOpportunity(opportunityKey, (opportunity) => ({
      ...opportunity,
      items: opportunity.items.map((item) => (item.id === itemId ? updater(item) : item)),
    }));
  };

  const addItem = (opportunityKey: string) => {
    updateOpportunity(opportunityKey, (opportunity) => ({
      ...opportunity,
      items: [...opportunity.items, createNewItem(opportunity.items.length + 1)],
    }));
  };

  const removeItem = (opportunityKey: string, itemId: string) => {
    updateOpportunity(opportunityKey, (opportunity) => ({
      ...opportunity,
      items: opportunity.items.filter((item) => item.id !== itemId),
    }));
  };

  const resetDefaults = () => {
    if (!selectedProjectSlug) {
      return;
    }
    setOpportunities(buildDefaultOpportunities(selectedProjectSlug));
    setNotice("");
    setError("");
  };

  const handleSave = async () => {
    if (!selectedProjectSlug || opportunities.length === 0) {
      return;
    }

    setIsSaving(true);
    setError("");
    setNotice("");

    const sanitized = opportunities.map((opportunity) => ({
      ...opportunity,
      projectSlug: selectedProjectSlug,
      items: opportunity.items.filter((item) => item.labelFa.trim() || item.labelEn.trim()),
    }));

    const response = await saveProjectOpportunities(sanitized);

    if (response.error) {
      setError(response.error.message);
      setIsSaving(false);
      return;
    }

    setNotice(locale === "fa" ? "تغییرات فرصت‌های همکاری ذخیره شد." : "Collaboration opportunities were saved.");
    setIsSaving(false);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>{labels.title}</h2>
        <p>{labels.subtitle}</p>
      </div>

      {notice && <div className={styles.notice}>{notice}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.controls}>
        <label className={styles.projectSelector}>
          <span>{labels.project}</span>
          <select
            value={selectedProjectSlug}
            onChange={(event) => setSelectedProjectSlug(event.target.value)}
            disabled={isLoadingProjects || projects.length === 0}
          >
            {projects.length === 0 && <option value="">{labels.projectPlaceholder}</option>}
            {projects.map((project) => (
              <option key={project.slug} value={project.slug}>
                {project.title} ({project.slug})
              </option>
            ))}
          </select>
        </label>

        <div className={styles.actionsRow}>
          <button type="button" onClick={resetDefaults} className={styles.secondaryBtn} disabled={!selectedProjectSlug}>
            {labels.resetDefaults}
          </button>
          <button type="button" onClick={handleSave} className={styles.primaryBtn} disabled={isSaving || !selectedProjectSlug}>
            {isSaving ? (locale === "fa" ? "در حال ذخیره..." : "Saving...") : labels.saveAll}
          </button>
        </div>
      </div>

      {isLoadingProjects ? (
        <p>{labels.loadingProjects}</p>
      ) : projects.length === 0 ? (
        <p>{labels.emptyProjects}</p>
      ) : isLoadingOpportunities ? (
        <p>{labels.loadingOpportunities}</p>
      ) : (
        <div className={styles.cardsGrid}>
          {opportunities.map((opportunity) => (
            <article key={opportunity.key} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>{locale === "fa" ? opportunity.titleFa : opportunity.titleEn}</h3>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    checked={opportunity.isEnabled}
                    onChange={(event) =>
                      updateOpportunity(opportunity.key, (item) => ({
                        ...item,
                        isEnabled: event.target.checked,
                      }))
                    }
                  />
                  <span>{labels.enabledCard}</span>
                </label>
              </div>

              <div className={styles.cardFields}>
                <label>
                  <span>{labels.titleFa}</span>
                  <input
                    value={opportunity.titleFa}
                    onChange={(event) =>
                      updateOpportunity(opportunity.key, (item) => ({
                        ...item,
                        titleFa: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span>{labels.titleEn}</span>
                  <input
                    value={opportunity.titleEn}
                    onChange={(event) =>
                      updateOpportunity(opportunity.key, (item) => ({
                        ...item,
                        titleEn: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span>{labels.subtitleFa}</span>
                  <input
                    value={opportunity.subtitleFa}
                    onChange={(event) =>
                      updateOpportunity(opportunity.key, (item) => ({
                        ...item,
                        subtitleFa: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span>{labels.subtitleEn}</span>
                  <input
                    value={opportunity.subtitleEn}
                    onChange={(event) =>
                      updateOpportunity(opportunity.key, (item) => ({
                        ...item,
                        subtitleEn: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>

              <div className={styles.itemsSection}>
                {opportunity.items.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <div className={styles.itemTopRow}>
                      <label className={styles.switchLabel}>
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(event) =>
                            updateItem(opportunity.key, item.id, (current) => ({
                              ...current,
                              enabled: event.target.checked,
                            }))
                          }
                        />
                        <span>{labels.enabledItem}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => removeItem(opportunity.key, item.id)}
                        className={styles.removeBtn}
                      >
                        {labels.removeItem}
                      </button>
                    </div>

                    <label>
                      <span>{labels.itemLabelFa}</span>
                      <input
                        value={item.labelFa}
                        onChange={(event) =>
                          updateItem(opportunity.key, item.id, (current) => ({
                            ...current,
                            labelFa: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>{labels.itemLabelEn}</span>
                      <input
                        value={item.labelEn}
                        onChange={(event) =>
                          updateItem(opportunity.key, item.id, (current) => ({
                            ...current,
                            labelEn: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>{labels.itemDescFa}</span>
                      <textarea
                        rows={2}
                        value={item.descriptionFa}
                        onChange={(event) =>
                          updateItem(opportunity.key, item.id, (current) => ({
                            ...current,
                            descriptionFa: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>{labels.itemDescEn}</span>
                      <textarea
                        rows={2}
                        value={item.descriptionEn}
                        onChange={(event) =>
                          updateItem(opportunity.key, item.id, (current) => ({
                            ...current,
                            descriptionEn: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => addItem(opportunity.key)} className={styles.addBtn}>
                {labels.addItem}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
