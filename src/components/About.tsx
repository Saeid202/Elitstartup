"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck } from "lucide-react";
import styles from "./About.module.css";

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className={styles.section}>
      <div className={styles.glowSpot} />

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={styles.textCol}
          >
            <div className={styles.badge}>
              <ShieldCheck size={16} />
              <span>{t.header.brandSub}</span>
            </div>
            
            <h2 className={styles.title}>{t.about.title}</h2>
            <h3 className={styles.subtitle}>{t.about.subtitle}</h3>
            
            <p className={styles.desc}>{t.about.description1}</p>
            <p className={styles.desc}>{t.about.description2}</p>
          </motion.div>

          {/* Stats Column */}
          <div className={styles.statsCol}>
            {t.about.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={styles.statCard}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
