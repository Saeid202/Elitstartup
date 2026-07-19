"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Lightbulb, FileText, CheckCircle } from "lucide-react";
import styles from "./Process.module.css";

export const Process: React.FC = () => {
  const { t } = useLanguage();

  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Search size={24} />;
      case 1:
        return <Lightbulb size={24} />;
      case 2:
        return <FileText size={24} />;
      case 3:
        return <CheckCircle size={24} />;
      default:
        return <Search size={24} />;
    }
  };

  return (
    <section id="services" className={styles.processSection}>
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
            {t.process.title.split(" ").map((word, i) => {
              // Highlight the last word or specific terms
              const isHighlight = i >= t.process.title.split(" ").length - 2;
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
            {t.process.subtitle}
          </motion.p>
        </div>

        {/* Timeline of Steps */}
        <div className={styles.timeline}>
          {t.process.steps.map((step, index) => (
            <div key={index} className={styles.stepWrapper}>
              <div className={styles.timelineDot} />
              
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={styles.stepCard}
              >
                <span className={styles.stepNumber}>0{index + 1}</span>
                
                <div className={styles.iconContainer}>
                  {getStepIcon(index)}
                </div>
                
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
