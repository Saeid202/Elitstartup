"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./CTAStrip.module.css";

export const CTAStrip: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className={styles.strip}>
      <div className={styles.glowSpot} />

      <div className={styles.container}>
        {/* Animated text on the left */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={styles.text}
        >
          {t.cta.text}
        </motion.p>

        {/* Animated button on the right */}
        <motion.a
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          href="https://wa.me/14168825015"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsappBtn}
        >
          {/* WhatsApp Icon */}
          <svg
            className={styles.whatsappIcon}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.977 14.113.953 11.999.953c-5.438 0-9.863 4.37-9.867 9.8-.001 1.774.485 3.5 1.408 5.008L2.53 20.352l4.117-1.198zm11.23-7.206c-.3-.15-1.772-.875-2.046-.975-.275-.1-.475-.15-.675.15-.2.3-.775.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.265-.467-2.41-1.485-.89-.795-1.49-1.777-1.665-2.077-.175-.3-.018-.463.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525C10.512 7.15 9.9 5.65 9.645 5.03c-.25-.6-.505-.519-.69-.527-.175-.008-.375-.01-.575-.01-.2 0-.525.075-.8 1.05-.275.975-1.05 3.074-1.15 3.274-.1.2-.2.425-.05.725.15.3.6 2.51 1.83 3.585 1.59 1.4 2.925 1.835 3.975 2.23.625.235 1.125.19 1.55.127.475-.07 1.472-.6 1.673-1.18.2-.58.2-1.075.14-1.18-.06-.1-.225-.15-.525-.3z" />
          </svg>
          <span>{t.cta.button}</span>
        </motion.a>
      </div>
    </section>
  );
};
