"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Activity, TrendingUp, Check, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./projects.module.css";

type ProjectCategory = "all" | "green" | "health" | "finance";

export default function ProjectsPage() {
  const { t, locale, dir } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = t.projectsSlider || [];

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToProject = (id: string) => {
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
  };

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

  // Localized static labels
  const labels = {
    fa: {
      all: "همه پروژه‌ها",
      green: "تکنولوژی سبز",
      health: "سلامت دیجیتال",
      finance: "فناوری مالی",
      sector: "حوزه فعالیت:",
      requiredRole: "نقش‌های مورد نیاز:",
      designatedOrg: "نوع سازمان حمایتی:",
      phase: "مراحل طی شده:",
      roles: {
        "eco-track": "هم‌بنیان‌گذار ارشد (CTO) / مدیر فنی",
        "med-vibe": "هم‌بنیان‌گذار بازاریابی (CMO) / مدیر فروش",
        "fin-flow": "هم‌بنیان‌گذار عملیات (COO) / مدیر اجرایی"
      },
      org: {
        "eco-track": "انکوباتور رسمی عضو سازمان مهاجرت (Designated Incubator)",
        "med-vibe": "گروه فرشتگان سرمایه‌گذار رسمی (Angel Investor Group)",
        "fin-flow": "انکوباتور رسمی بین‌المللی (Designated Incubator)"
      },
      phaseVal: {
        "eco-track": "نامه حمایتی اخذ شده - در مرحله سابمیت پرونده مهاجرتی",
        "med-vibe": "بیزنس پلن نهایی - در حال دفاع در انکوباتور",
        "fin-flow": "نامه حمایتی فعال - آماده اقدام جهت ویزای کار"
      },
      applyBtn: "درخواست هم‌بنیان‌گذاری در واتس‌اپ",
      whatsappMsg: (title: string) => `سلام وقت بخیر. من علاقمند به هم‌بنیان‌گذاری و بررسی شرایط در پروژه استارتاپی ${title} هستم. لطفاً راهنمایی بفرمایید.`
    },
    en: {
      all: "All Projects",
      green: "GreenTech",
      health: "HealthTech",
      finance: "FinTech",
      sector: "Sector:",
      requiredRole: "Required Role:",
      designatedOrg: "Designated Org Type:",
      phase: "Current Phase:",
      roles: {
        "eco-track": "Technical Co-founder / Chief Technology Officer (CTO)",
        "med-vibe": "Marketing Co-founder / Chief Marketing Officer (CMO)",
        "fin-flow": "Operations Co-founder / Chief Operating Officer (COO)"
      },
      org: {
        "eco-track": "Designated Business Incubator (Approved Org)",
        "med-vibe": "Designated Angel Investor Group (Approved Org)",
        "fin-flow": "Designated Business Incubator (Approved Org)"
      },
      phaseVal: {
        "eco-track": "LOS Issued - Currently Preparing Work Permit Submission",
        "med-vibe": "Business Plan Finalized - Pitching to Designates",
        "fin-flow": "LOS Active - Ready for Work Permit & PR Action"
      },
      applyBtn: "Apply for Co-founder via WhatsApp",
      whatsappMsg: (title: string) => `Hello. I am interested in joining the ${title} project as a co-founder. Could you please provide more information?`
    }
  }[locale];

  // Filter projects based on active selection
  const filteredProjects = t.projects.list.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "green") return project.id === "eco-track";
    if (activeFilter === "health") return project.id === "med-vibe";
    if (activeFilter === "finance") return project.id === "fin-flow";
    return true;
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
            {(["all", "green", "health", "finance"] as ProjectCategory[]).map((filter) => (
              <button
                key={filter}
                className={`${styles.filterBtn} ${activeFilter === filter ? styles.activeFilter : ""}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "all" && labels.all}
                {filter === "green" && labels.green}
                {filter === "health" && labels.health}
                {filter === "finance" && labels.finance}
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
                      <div className={styles.iconWrapper}>
                        {getProjectIcon(project.id)}
                      </div>
                      <div>
                        <span className={styles.categoryTag}>{project.category}</span>
                        <h2 className={styles.projectTitle}>{project.title}</h2>
                      </div>
                    </div>
                    <span className={styles.statusBadge}>
                      {project.id === "med-vibe" ? t.projects.statusReady : t.projects.statusCompleted}
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
                          <span className={styles.tableValue}>{project.category}</span>
                        </div>

                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.requiredRole}</span>
                          <span className={styles.tableValue}>
                            {labels.roles[project.id as keyof typeof labels.roles]}
                          </span>
                        </div>

                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.designatedOrg}</span>
                          <span className={styles.tableValue}>
                            {labels.org[project.id as keyof typeof labels.org]}
                          </span>
                        </div>

                        <div className={styles.tableRow}>
                          <span className={styles.tableLabel}>{labels.phase}</span>
                          <span className={styles.tableValue}>
                            {labels.phaseVal[project.id as keyof typeof labels.phaseVal]}
                          </span>
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
