"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Globe, Menu, X, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const { locale, t, toggleLanguage, dir } = useLanguage();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    setMenuOpen(false);
    if (!isHomePage) {
      // If we are on the projects page, let the default Link navigation run
      return;
    }
    
    // Otherwise scroll smoothly on home page
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
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
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logoContainer}>
          <span className={styles.logoText}>{t.header.brand}</span>
          <span className={styles.logoSubtext}>{t.header.brandSub}</span>
        </Link>

        {/* Navigation links */}
        <nav className={`${styles.nav} ${menuOpen ? styles.navActive : ""}`}>
          <div className={styles.navLinks}>
            <a
              href="/#about"
              onClick={(e) => handleLinkClick(e, "about")}
              className={styles.navLink}
            >
              {t.header.about}
            </a>
            <a
              href="/#services"
              onClick={(e) => handleLinkClick(e, "services")}
              className={styles.navLink}
            >
              {t.header.services}
            </a>
            <Link href="/projects" onClick={() => setMenuOpen(false)} className={styles.navLink}>
              {t.header.projects}
            </Link>
            {user && (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)} className={styles.navLink}>
                {locale === "fa" ? "داشبورد" : "Dashboard"}
              </Link>
            )}
            <a
              href="/#contact"
              onClick={(e) => handleLinkClick(e, "contact")}
              className={styles.navLink}
            >
              {t.header.contact}
            </a>
          </div>

          {/* Action buttons inside mobile nav drawer */}
          <div className={styles.actions}>
            <button className={styles.langBtn} onClick={toggleLanguage}>
              <Globe size={16} />
              <span>{t.header.langName}</span>
            </button>
            {!user ? (
              <Link href="/login" onClick={() => setMenuOpen(false)} className={styles.loginBtn}>
                {locale === "fa" ? "ورود / ثبت‌نام" : "Login / Signup"}
              </Link>
            ) : (
              <button onClick={() => { setMenuOpen(false); signOut(); }} className={styles.logoutBtn}>
                {locale === "fa" ? "خروج" : "Logout"}
              </button>
            )}
            <a
              href="https://wa.me/14168825015"
              target="_blank"
              rel="noopener noreferrer"
              className={`btn-gold ${styles.ctaBtn}`}
            >
              <span>{t.header.cta}</span>
              {dir === "rtl" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </a>
          </div>
        </nav>

        {/* Burger Button for mobile */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>
  );
};
