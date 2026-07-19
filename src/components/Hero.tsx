"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

export const Hero: React.FC = () => {
  const { t, dir } = useLanguage();

  const handleScrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const headerOffset = 90;
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScrollToProjects = () => {
    const projectsSection = document.getElementById("projects-showcase");
    if (projectsSection) {
      const headerOffset = 90;
      const elementPosition = projectsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className={styles.hero}>
      {/* Visual background decorations */}
      <div className={styles.gridOverlay} />
      <div className={styles.glowSpot1} />
      <div className={styles.glowSpot2} />

      <div className={styles.container}>
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={styles.badge}
        >
          <Sparkles size={14} />
          <span>{t.header.brandSub}</span>
        </motion.div>

        {/* Animated Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.title}
        >
          <span className={styles.titleHighlight}>{t.hero.title}</span>
        </motion.h1>

        {/* Animated Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={styles.subtitle}
        >
          {t.hero.subtitle}
        </motion.p>

        {/* Animated CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={styles.actions}
        >
          <a
            href="https://wa.me/14168825015"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnPrimary}
          >
            <span>{t.hero.ctaPrimary}</span>
            {dir === "rtl" ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          </a>
          <button onClick={handleScrollToProjects} className={styles.btnSecondary}>
            <span>{t.hero.ctaSecondary}</span>
          </button>
        </motion.div>
      </div>

      {/* Mouse Scroll Indicator */}
      <div className={styles.scrollIndicator} onClick={handleScrollToAbout}>
        <div className={styles.mouse} />
      </div>
    </section>
  );
};
