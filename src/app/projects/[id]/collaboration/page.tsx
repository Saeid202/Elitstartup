"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { fetchProjectOpportunities, type CollaborationOpportunity } from "@/lib/collaborationOpportunities";
import { fetchPublishedProjects } from "@/lib/projects";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  DollarSign, 
  Megaphone, 
  Code, 
  Users, 
  Check, 
  ArrowLeft, 
  ArrowRight,
  Briefcase,
  X,
  Send,
  Sparkles
} from "lucide-react";
import styles from "./collaboration.module.css";

export default function CollaborationPage() {
  const { id } = useParams();
  const { locale, dir } = useLanguage();
  const router = useRouter();
  const { user, profile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    role: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [projectName, setProjectName] = useState("");
  const [opportunities, setOpportunities] = useState<CollaborationOpportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  useEffect(() => {
    const loadProjectName = async () => {
      const currentId = String(id || "");
      const dbProjects = await fetchPublishedProjects();
      const matched = dbProjects.find((project) => project.slug === currentId);
      if (matched) {
        setProjectName(matched.title);
        return;
      }

      switch (currentId) {
        case "eco-track":
          setProjectName("EcoTrack");
          break;
        case "med-vibe":
          setProjectName("MedVibe");
          break;
        case "fin-flow":
          setProjectName("FinFlow");
          break;
        default:
          setProjectName(currentId || "Project");
          break;
      }
    };

    loadProjectName();
  }, [id]);

  useEffect(() => {
    const loadOpportunities = async () => {
      const currentId = String(id || "");
      setLoadingOpportunities(true);
      const data = await fetchProjectOpportunities(currentId, false);
      setOpportunities(data.filter((item) => item.isEnabled));
      setLoadingOpportunities(false);
    };

    loadOpportunities();
  }, [id]);

  const getOpportunityIcon = (key: string) => {
    switch (key) {
      case "biz-dev":
        return <Building2 size={28} />;
      case "sales":
        return <DollarSign size={28} />;
      case "marketing":
        return <Megaphone size={28} />;
      case "dev":
        return <Code size={28} />;
      case "biz-partner":
        return <Users size={28} />;
      default:
        return <Briefcase size={28} />;
    }
  };

  // Benefits data
  const benefitsFa = [
    "همکاری در یک استارتاپ واقعی",
    "مشارکت در توسعه بازار بین‌المللی",
    "فرصت همکاری با تیم‌های چندملیتی",
    "امکان مشارکت در توسعه شرکت در کشور مقصد"
  ];

  const benefitsEn = [
    "Collaboration in a real startup",
    "Participation in international market development",
    "Opportunity to work with multi-national teams",
    "Possibility of participating in company development in the destination country"
  ];

  const handleRegisterInterest = (roleTitle: string) => {
    if (!user) {
      router.push(`/login?redirect=/projects/${id}/collaboration&message=auth-required`);
      return;
    }
    setFormData({
      fullName: profile?.full_name || "",
      phone: profile?.phone || "",
      email: user.email || "",
      role: roleTitle,
      message: ""
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenCtaModal = () => {
    if (!user) {
      router.push(`/login?redirect=/projects/${id}/collaboration&message=auth-required`);
      return;
    }
    setFormData({
      fullName: profile?.full_name || "",
      phone: profile?.phone || "",
      email: user.email || "",
      role: "",
      message: ""
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const { error } = await supabase
        .from("user_interests")
        .insert({
          user_id: user.id,
          project_id: id as string,
          project_title: projectName,
          role: formData.role,
          message: formData.message
        });

      if (error) {
        setErrorMessage(error.message);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  // WhatsApp click handler
  const getWhatsAppLink = () => {
    const text = locale === "fa" 
      ? `سلام. من علاقه‌مند به فرصت‌های همکاری در پروژه ${projectName} هستم.`
      : `Hello, I am interested in collaboration opportunities for the ${projectName} project.`;
    return `https://wa.me/14168825015?text=${encodeURIComponent(text)}`;
  };

  return (
    <>
      <Header />

      <main className={styles.page}>
        {/* Glow Spots */}
        <div className={styles.glowSpot} />
        <div className={styles.glowSpot2} />

        <div className={styles.container}>
          {/* Back button */}
          <button onClick={() => router.back()} className={styles.backBtn}>
            {dir === "rtl" ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            <span>{locale === "fa" ? "بازگشت به پروژه‌ها" : "Back to Projects"}</span>
          </button>

          {/* Hero Section */}
          <div className={styles.hero}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.heroTitle}
            >
              {locale === "fa" ? `فرصت‌های همکاری در پروژه ${projectName}` : `Collaboration Opportunities in ${projectName}`}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={styles.heroSubtitle}
            >
              {locale === "fa" 
                ? "اگر علاقه‌مند هستید در توسعه این استارتاپ مشارکت داشته باشید، می‌توانید یکی از نقش‌های زیر را انتخاب کنید." 
                : "If you are interested in contributing to the growth of this startup, you can choose from the roles below."}
            </motion.p>
            <div className={styles.divider} />
          </div>

          {/* Introduction Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={styles.introCard}
          >
            <div className={styles.introIcon}>
              <Sparkles size={32} />
            </div>
            <div className={styles.introText}>
              <h2 className={styles.introTitle}>{locale === "fa" ? "معرفی کوتاه" : "Brief Introduction"}</h2>
              <p>
                {locale === "fa" 
                  ? `هدف ما تشکیل یک تیم حرفه‌ای برای توسعه استارتاپ ${projectName} و راه‌اندازی فعالیت آن در بازار کشور مقصد است.`
                  : `Our goal is to build a professional team to develop ${projectName} and launch its activities in the destination country.`}
              </p>
              <p className={styles.introHighlight}>
                {locale === "fa"
                  ? "اعضای منتخب تیم می‌توانند در توسعه کسب‌وکار، مدیریت و فعالیت‌های تجاری مشارکت داشته باشند."
                  : "Selected team members can actively participate in business development, management, and commercial operations."}
              </p>
            </div>
          </motion.div>

          {/* Opportunities Section */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionMainTitle}>{locale === "fa" ? "فرصت‌های همکاری موجود" : "Available Opportunities"}</h2>
          </div>

          <div className={styles.oppsGrid}>
            {loadingOpportunities ? (
              <div className={styles.emptyOverview}>
                <p>{locale === "fa" ? "در حال بارگذاری فرصت‌ها..." : "Loading opportunities..."}</p>
              </div>
            ) : opportunities.length === 0 ? (
              <div className={styles.emptyOverview}>
                <p>{locale === "fa" ? "در حال حاضر فرصت فعالی تعریف نشده است." : "No active opportunities are configured yet."}</p>
              </div>
            ) : opportunities.map((opp, idx) => (
              <motion.div
                key={opp.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className={styles.oppCard}
              >
                <div className={styles.oppHeader}>
                  <div className={styles.oppIconWrapper}>{getOpportunityIcon(opp.key)}</div>
                  <div>
                    <h3 className={styles.oppTitle}>{locale === "fa" ? opp.titleFa : opp.titleEn}</h3>
                    <span className={styles.oppSubtitle}>{locale === "fa" ? opp.subtitleFa : opp.subtitleEn}</span>
                  </div>
                </div>
                
                <ul className={styles.oppBullets}>
                  {opp.items.filter((item) => item.enabled).map((item, bIdx) => (
                    <li key={bIdx} className={styles.oppBulletItem}>
                      <span className={styles.bulletCheck}></span>
                      <div className={styles.oppBulletContent}>
                        <span className={styles.oppBulletTitle}>{locale === "fa" ? item.labelFa : item.labelEn}</span>
                        {(locale === "fa" ? item.descriptionFa : item.descriptionEn) && (
                          <span className={styles.oppBulletDescription}>
                            {locale === "fa" ? item.descriptionFa : item.descriptionEn}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleRegisterInterest(locale === "fa" ? opp.titleFa : opp.titleEn)}
                  className={styles.oppBtn}
                >
                  {locale === "fa" ? "ثبت علاقه‌مندی" : "Register Interest"}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className={styles.benefitsSection}>
            <h2 className={styles.sectionMainTitle}>{locale === "fa" ? "مزایای همکاری با ما" : "Collaboration Benefits"}</h2>
            
            <div className={styles.benefitsGrid}>
              {(locale === "fa" ? benefitsFa : benefitsEn).map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  className={styles.benefitCard}
                >
                  <div className={styles.benefitIcon}>
                    <Check size={20} />
                  </div>
                  <span className={styles.benefitText}>{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Call to Action (CTA) Section */}
          <div className={styles.ctaContainer}>
            {/* Create Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.ctaCard}
            >
              <div className={styles.ctaIcon}>
                <Briefcase size={36} />
              </div>
              <h3 className={styles.ctaTitle}>{locale === "fa" ? "ایجاد پروفایل" : "Create Profile"}</h3>
              <p className={styles.ctaText}>
                {locale === "fa"
                  ? "با ایجاد پروفایل، در بانک استعدادهای ELIT ثبت می‌شوید و در صورت نیاز این پروژه یا پروژه‌های مشابه، به شما اطلاع داده خواهد شد."
                  : "By creating a profile, you will be registered in the ELIT talent pool, and you will be notified if this project or similar projects need your skills."}
              </p>
              <button onClick={handleOpenCtaModal} className={styles.ctaBtnGold}>
                {locale === "fa" ? "پروفایل خود را ایجاد کنید" : "Create Your Profile"}
              </button>
            </motion.div>

            {/* Direct WhatsApp Card */}
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className={styles.ctaCard}
            >
              <div className={styles.ctaIcon}>
                <Users size={36} />
              </div>
              <h3 className={styles.ctaTitle}>{locale === "fa" ? "ارتباط مستقیم" : "Direct Connection"}</h3>
              <p className={styles.ctaText}>
                {locale === "fa"
                  ? "اگر ترجیح می‌دهید شرایط همکاری و نقش خود را سریعاً با مشاوران ما بررسی کنید، از طریق ارتباط مستقیم در واتساپ پیام دهید."
                  : "If you prefer to immediately discuss collaboration opportunities and your role with our advisors, send us a direct message on WhatsApp."}
              </p>
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.ctaBtnOutline}
              >
                {locale === "fa" ? "درخواست هم‌بنیان‌گذاری در واتساپ" : "Apply as Co-founder on WhatsApp"}
              </a>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Registration Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={styles.modalContent}
            >
              <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn} aria-label="Close modal">
                <X size={24} />
              </button>

              {submitSuccess ? (
                <div className={styles.successWrapper}>
                  <div className={styles.successCircle}>
                    <Check size={48} />
                  </div>
                  <h3>{locale === "fa" ? "اطلاعات با موفقیت ثبت شد" : "Registration Successful"}</h3>
                  <p>
                    {locale === "fa"
                      ? "پروفایل شما در بانک استعدادهای الیت ثبت گردید. به زودی با شما تماس خواهیم گرفت."
                      : "Your profile has been saved in ELIT talent pool. We will contact you shortly."}
                  </p>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSubmitSuccess(false);
                      setFormData({
                        fullName: "",
                        phone: "",
                        email: "",
                        role: "",
                        message: ""
                      });
                    }}
                    className={styles.closeSuccessBtn}
                  >
                    {locale === "fa" ? "بستن پنجره" : "Close Window"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <h3 className={styles.formTitle}>
                    {locale === "fa" ? `ایجاد پروفایل همکاری - پروژه ${projectName}` : `Create Collaboration Profile - ${projectName}`}
                  </h3>
                  <p className={styles.formSubtitle}>
                    {locale === "fa"
                      ? "لطفاً اطلاعات خود را وارد نمایید تا در لیست ارزیابی قرار گیرید."
                      : "Please fill in your details to register for evaluation."}
                  </p>

                  {errorMessage && <div className={styles.errorAlert}>{errorMessage}</div>}

                  <div className={styles.formGroup}>
                    <label htmlFor="fullName">{locale === "fa" ? "نام و نام خانوادگی" : "Full Name"}</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder={locale === "fa" ? "مثال: علی احمدی" : "e.g. John Doe"}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">{locale === "fa" ? "شماره تماس (ترجیحاً واتس‌اپ)" : "Phone Number (preferably WhatsApp)"}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder={locale === "fa" ? "مثال: 09123456789" : "e.g. +123456789"}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">{locale === "fa" ? "ایمیل (غیر قابل تغییر)" : "Email (Read-only)"}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      readOnly
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder={locale === "fa" ? "مثال: example@mail.com" : "e.g. example@mail.com"}
                      style={{ opacity: 0.7, cursor: "not-allowed" }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="role">{locale === "fa" ? "نقش مورد علاقه" : "Preferred Role"}</label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleFormChange}
                    >
                      <option value="">{locale === "fa" ? "-- انتخاب نقش --" : "-- Select Role --"}</option>
                      {opportunities.map(opp => (
                        <option key={opp.key} value={locale === "fa" ? opp.titleFa : opp.titleEn}>
                          {locale === "fa" ? opp.titleFa : opp.titleEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="message">{locale === "fa" ? "خلاصه سوابق یا توضیحات بیشتر" : "Brief Experience / Cover Message"}</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleFormChange}
                      placeholder={locale === "fa" ? "توضیح مختصری درباره تخصص خود بنویسید..." : "Write a short summary about your background..."}
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                    {isSubmitting ? (
                      <span className={styles.spinner}></span>
                    ) : (
                      <>
                        <span>{locale === "fa" ? "ثبت نهایی اطلاعات" : "Submit Details"}</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
