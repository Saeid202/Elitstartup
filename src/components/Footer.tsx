"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, Mail, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const element = document.getElementById(id);
    if (element) {
      e.preventDefault();
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info Column */}
          <div className={styles.brandCol}>
            <div className={styles.logoContainer}>
              <img
                src="/elite-logo.png"
                alt={t.header.brand}
                className={styles.logoImage}
              />
              <span className={styles.logoSubtext}>{t.header.brandSub}</span>
            </div>
            <p className={styles.brandDesc}>{t.footer.desc}</p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className={styles.title}>{t.footer.quickLinks}</h3>
            <ul className={styles.list}>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, "about")} className={styles.link}>
                  {t.header.about}
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, "services")} className={styles.link}>
                  {t.header.services}
                </a>
              </li>
              <li>
                <Link href="/projects" className={styles.link}>
                  {t.header.projects}
                </Link>
              </li>
              <li>
                <a href="#contact" onClick={(e) => handleLinkClick(e, "contact")} className={styles.link}>
                  {t.header.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info Column */}
          <div>
            <h3 className={styles.title}>{t.footer.contactInfo}</h3>
            <ul className={styles.list}>
              <li className={styles.contactItem}>
                <Phone size={18} className={styles.contactIcon} />
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {t.footer.phone}
                  </span>
                  <a href="tel:+14168825015" style={{ direction: "ltr", display: "inline-block" }}>
                    +1 (416) 882-5015
                  </a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <Mail size={18} className={styles.contactIcon} />
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {t.footer.email}
                  </span>
                  <a href="mailto:shabani_saeid@hotmail.com">
                    shabani_saeid@hotmail.com
                  </a>
                </div>
              </li>
              <li className={styles.contactItem}>
                <MapPin size={18} className={styles.contactIcon} />
                <div>
                  <span style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {t.footer.address}
                  </span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=1050+King+St+W+1st+Floor%2C+Toronto%2C+ON+M6K+0C7"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", direction: "ltr" }}
                  >
                    1050 King St W 1st Floor, Toronto, ON M6K 0C7
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>{t.footer.copyright}</p>
          <p className={styles.credits}>
            <span>Designed by </span>
            <span style={{ color: "var(--accent-gold)", fontWeight: 600 }}>Antigravity</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
