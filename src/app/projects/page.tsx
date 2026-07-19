"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { getProjectLogoPublicUrl } from "@/lib/projects";
import { fetchPublishedProjects, type StartupProjectRecord } from "@/lib/projects";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Activity, TrendingUp, Check, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./projects.module.css";

interface DisplayProject {
  id: string;
  title: string;
  category: string;
  losStatus: string;
  description: string;
  benefits: string[];
  sector: string;
  requiredRoles: string;
  showDesignatedOrg: boolean;
  designatedOrgType: string | null;
  currentPhase: string;
  availableCountries: string;
  logoUrl: string | null;
  websiteUrl: string | null;
}

export default function ProjectsPage() {
  const { t, locale, dir } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState<DisplayProject[]>([]);

  useEffect(() => {
    // If there is a hash in the URL (e.g. #eco-track), scroll to it smoothly
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 130;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 300);
    }
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const dbProjects = await fetchPublishedProjects();
      if (dbProjects.length > 0) {
        setProjects(
          dbProjects.map((project: StartupProjectRecord) => ({
            id: project.slug,
            title: project.title,
            category: project.category,
            losStatus: project.los_status,
            description: project.description,
            benefits: project.benefits || [],
            sector: project.sector,
            requiredRoles: project.required_roles,
            showDesignatedOrg: project.show_designated_org,
            designatedOrgType: project.designated_org_type,
            currentPhase: project.current_phase,
            availableCountries: project.available_countries,
            logoUrl: getProjectLogoPublicUrl(project.logo_path),
            websiteUrl: project.website_url,
          }))
        );
        return;
      }

      setProjects(
        t.projects.list.map((project) => ({
          id: project.id,
          title: project.title,
          category: project.category,
          losStatus: project.id === "med-vibe" ? t.projects.statusReady : t.projects.statusCompleted,
          description: project.description,
          benefits: project.benefits,
          sector: project.category,
          requiredRoles: locale === "fa" ? "در حال تکمیل" : "To be updated",
          showDesignatedOrg: false,
          designatedOrgType: null,
          currentPhase: locale === "fa" ? "در حال تکمیل" : "To be updated",
          availableCountries: locale === "fa" ? "در حال تکمیل" : "To be updated",
          logoUrl: null,
          websiteUrl: null,
        }))
      );
    };

    loadProjects();
  }, [locale, t.projects.list, t.projects.statusCompleted, t.projects.statusReady]);

  useEffect(() => {
    setActiveFilter("all");
  }, [projects]);

  const getProjectIcon = (id: string) => {
    switch (id) {
      case "eco-track":
        return <Leaf size={32} />;
      case "med-vibe":
        return <Activity size={32} />;
      case "fin-flow":
        return <TrendingUp size={32} />;
      default:
        return <Leaf size={32} />;
    }
  };

  const categoryFilters = [
    "all",
    ...Array.from(new Set(projects.map((project) => project.category).filter(Boolean))),
  ];

  // Localized static labels
  const labels = {
    fa: {
      all: "همه پروژه‌ها",
      sector: "حوزه فعالیت:",
      requiredRole: "نقش‌های مورد نیاز:",
      designatedOrg: "نوع سازمان حمایتی:",
      phase: "مراحل طی شده:",
      countries: "کشورهای قابل ارائه:",
      applyBtn: "درخواست هم‌بنیان‌گذاری در واتس‌اپ",
      whatsappMsg: (title: string) => `سلام وقت بخیر. من علاقمند به هم‌بنیان‌گذاری و بررسی شرایط در پروژه استارتاپی ${title} هستم. لطفاً راهنمایی بفرمایید.`
    },
    en: {
      all: "All Projects",
      sector: "Sector:",
      requiredRole: "Required Role:",
      designatedOrg: "Designated Org Type:",
      phase: "Current Phase:",
      countries: "Available Countries:",
      applyBtn: "Apply for Co-founder via WhatsApp",
      whatsappMsg: (title: string) => `Hello. I am interested in joining the ${title} project as a co-founder. Could you please provide more information?`
    }
  }[locale];

  // Filter projects based on active selection
  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    return project.category === activeFilter;
  });

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.glowSpot} />
        <div className={styles.glowSpot2} />

        <div className={styles.container}>
          {/* Header section */}
          <div className={styles.heroHeader}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.title}
            >
              {t.projects.title.split(" ").map((word, i) => {
                const isHighlight = i >= t.projects.title.split(" ").length - 2;
                return (
                  <span key={i} className={isHighlight ? styles.titleHighlight : ""}>
                    {word}{" "}
                  </span>
                );
              })}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className={styles.subtitle}
            >
              {t.projects.subtitle}
            </motion.p>
            <div className={styles.divider} />
          </div>

          {/* Filter Navigation */}
          <div className={styles.filterBar}>
            {categoryFilters.map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "all" ? labels.all : filter}
              </button>
            ))}
          </div>

          {/* Projects Details Grid */}
          <div className={styles.projectsGrid}>
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  id={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className={styles.projectCard}
                >
                  {/* Card Header */}
                  <div className={styles.cardHeader}>
                    <div className={styles.titleSection}>
                      {project.websiteUrl ? (
                        <a
                          href={project.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.projectIdentityLink}
                        >
                          <div className={styles.iconWrapper}>
                            {project.logoUrl ? (
                              <img src={project.logoUrl} alt={`${project.title} logo`} className={styles.projectLogoImage} />
                            ) : (
                              getProjectIcon(project.id)
                            )}
                          </div>
                          <div>
                            <span className={styles.categoryTag}>{project.category}</span>
                            <h2 className={styles.projectTitle}>{project.title}</h2>
                          </div>
                        </a>
                      ) : (
                        <>
                          <div className={styles.iconWrapper}>
                            {project.logoUrl ? (
                              <img src={project.logoUrl} alt={`${project.title} logo`} className={styles.projectLogoImage} />
                            ) : (
                              getProjectIcon(project.id)
                            )}
                          </div>
                          <div>
                            <span className={styles.categoryTag}>{project.category}</span>
                            <h2 className={styles.projectTitle}>{project.title}</h2>
                          </div>
                        </>
                      )}
                    </div>
                    <span className={styles.statusBadge}>
                      {project.losStatus}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className={styles.cardBody}>
                    {/* Main description and details */}
                    <div className={styles.mainContent}>
                      <div className={styles.detailSection}>
                        <h3 className={styles.sectionTitle}>{locale === "fa" ? "شرح استارتاپ" : "Startup Description"}</h3>
                        <p className={styles.description}>{project.description}</p>
                      </div>

                      <div className={styles.detailSection}>
                        <h3 className={styles.sectionTitle}>{locale === "fa" ? "مزایای پیوستن به این تیم" : "Key Benefits"}</h3>
                        <ul className={styles.benefitList}>
                          {project.benefits.map((benefit, bIndex) => (
                            <li key={bIndex} className={styles.benefitItem}>
                              <Check size={18} className={styles.checkIcon} />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Sidebar with tech specs table */}
                    <div className={styles.sidebar}>
                      <h3 className={styles.sectionTitle}>{locale === "fa" ? "مشخصات و وضعیت پرونده" : "Startup Specifications"}</h3>
                      
                      <div className={styles.specsTable}>
                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.sector}</span>
                          <span className={styles.tableValue}>{project.sector}</span>
                        </div>

                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.requiredRole}</span>
                          <span className={styles.tableValue}>{project.requiredRoles}</span>
                        </div>

                        {project.showDesignatedOrg && project.designatedOrgType && (
                          <div className={styles.tableRow}>
                            <span className={styles.tableLabel}>{labels.designatedOrg}</span>
                            <span className={styles.tableValue}>{project.designatedOrgType}</span>
                          </div>
                        )}

                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.phase}</span>
                          <span className={styles.tableValue}>{project.currentPhase}</span>
                        </div>

                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.countries}</span>
                          <span className={styles.tableValue}>{project.availableCountries}</span>
                        </div>
                      </div>

                      {/* WhatsApp Apply Action */}
                      <a
                        href={`https://wa.me/14168825015?text=${encodeURIComponent(labels.whatsappMsg(project.title))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.applyBtn}
                      >
                        <span>{labels.applyBtn}</span>
                        {dir === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </a>

                      {/* Collaboration Opportunities Link */}
                      <Link
                        href={`/projects/${project.id}/collaboration`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.collabBtn}
                      >
                        <span>{locale === "fa" ? "فرصت‌های همکاری" : "Collaboration Opportunities"}</span>
                        {dir === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
