"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Check, ArrowLeft, ArrowRight, Activity, Leaf, TrendingUp } from "lucide-react";
import styles from "./ProjectsShowcase.module.css";

export const ProjectsShowcase: React.FC = () => {
  const { t, dir } = useLanguage();

  const getProjectIcon = (id: string) => {
    switch (id) {
      case "eco-track":
        return <Leaf size={48} className={styles.projectLogo} />;
      case "med-vibe":
        return <Activity size={48} className={styles.projectLogo} />;
      case "fin-flow":
        return <TrendingUp size={48} className={styles.projectLogo} />;
      default:
        return <Leaf size={48} className={styles.projectLogo} />;
    }
  };

  const getProjectBgGradient = (id: string) => {
    switch (id) {
      case "eco-track":
        return "linear-gradient(135deg, #061e1a 0%, #050b14 100%)";
      case "med-vibe":
        return "linear-gradient(135deg, #1b0a1c 0%, #050b14 100%)";
      case "fin-flow":
        return "linear-gradient(135deg, #1f1b0a 0%, #050b14 100%)";
      default:
        return "linear-gradient(135deg, #0e1b2f 0%, #050b14 100%)";
    }
  };

  return (
    <section id="projects-showcase" className={styles.section}>
      <div className={styles.glowSpot} />

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
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
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.subtitle}
          >
            {t.projects.subtitle}
          </motion.p>
        </div>

        {/* Projects List */}
        <div className={styles.projectsList}>
          {t.projects.list.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={styles.projectCard}
            >
              {/* Image / Graphic column */}
              <div className={styles.imageCol}>
                <div 
                  className={styles.imagePlaceholder}
                  style={{ background: getProjectBgGradient(project.id) }}
                >
                  <div className={styles.imageOverlay} />
                  {getProjectIcon(project.id)}
                  <span style={{ color: "var(--accent-gold)", fontWeight: 600, fontSize: "1.2rem", zIndex: 3 }}>
                    {project.title.split(" (")[0]}
                  </span>
                </div>
              </div>

              {/* Content column */}
              <div className={styles.contentCol}>
                <div className={styles.tagRow}>
                  <span className={styles.categoryTag}>{project.category}</span>
                  <span className={styles.statusTag}>
                    {index === 1 ? t.projects.statusReady : t.projects.statusCompleted}
                  </span>
                </div>
                
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.description}>{project.description}</p>
                
                <ul className={styles.benefitsList}>
                  {project.benefits.map((benefit, bIndex) => (
                    <li key={bIndex} className={styles.benefitItem}>
                      <Check size={16} className={styles.checkIcon} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/projects#${project.id}`} className={styles.readMoreBtn}>
                  <span>{t.projects.readMore}</span>
                  {dir === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <div className={styles.footerRow}>
          <Link href="/projects" className={styles.viewAllBtn}>
            <span>{t.projects.allProjects}</span>
            {dir === "rtl" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </Link>
        </div>
      </div>
    </section>
  );
};
