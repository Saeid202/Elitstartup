"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldCheck, UserRound, Building2 } from "lucide-react";
import styles from "./About.module.css";

export const About: React.FC = () => {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"founder" | "company">("founder");

  const founderMilestones = useMemo(() => {
    if (locale === "fa") {
      return [
        {
          period: "2009-2013",
          title: "شروع مسیر حقوق و نگاه بین‌المللی",
          summary: "آغاز تحصیل حقوق و تکمیل همزمان دوره‌های تخصصی داوری و مذاکرات بین‌المللی.",
          detail:
            "در سال ۲۰۰۹، سعید شبانی تحصیل در رشته حقوق را آغاز کرد و همزمان دوره‌های تخصصی داوری تجاری بین‌المللی، مذاکرات بین‌المللی، جامعه‌شناسی، زبان انگلیسی و زبان فرانسه را گذراند. هدف اولیه ادامه تحصیل در یکی از دانشگاه‌های اروپا بود.",
        },
        {
          period: "2013-2015",
          title: "تغییر مسیر به چین و تحصیل در دانشگاه شیامن",
          summary: "یک تصمیم غیرمنتظره، مقصد را از اروپا به چین تغییر داد.",
          detail:
            "پس از تاثیر یک مستند درباره اقتصاد چین، مسیر زندگی او تغییر کرد. در سال ۲۰۱۳ با دریافت پذیرش از دانشگاه شیامن چین، به عنوان نخستین دانشجوی ایرانی در مقطع کارشناسی ارشد حقوق تجارت و حقوق مدنی چین وارد این دانشگاه شد و در سال ۲۰۱۵ فارغ‌التحصیل گردید.",
        },
        {
          period: "پس از 2015",
          title: "انتخاب شانگهای و ورود به اکوسیستم تجارت جهانی",
          summary: "از میان چند پذیرش مهم بین‌المللی، دانشگاه جیاتونگ شانگهای انتخاب شد.",
          detail:
            "پس از دریافت همزمان پذیرش از چند دانشگاه مطرح، به دلیل جایگاه شانگهای به عنوان یکی از مهم‌ترین مراکز اقتصادی جهان، دانشگاه جیاتونگ را برای ادامه مسیر انتخاب کرد. او سپس به کمیته حقوقی اتاق بازرگانی شانگهای پیوست و در توسعه همکاری‌های حقوقی و تجاری ایران و چین نقش فعال داشت.",
        },
        {
          period: "China & India",
          title: "گسترش همکاری‌های تجاری در آسیا",
          summary: "تجربه عملی در پروژه‌های بین‌المللی و همکاری با برندهای صنعتی بزرگ.",
          detail:
            "فعالیت‌های تجاری او به هند نیز گسترش یافت و در پروژه‌های بین‌المللی با شرکت‌هایی مانند Force Motors و Tata Motors همکاری کرد؛ تجربه‌ای ارزشمند در تجارت بین‌الملل میان چین و هند.",
        },
        {
          period: "Canada Era",
          title: "ورود به کانادا و تولد مسیر استارتاپی",
          summary: "از Smart Immigration تا Court AI و ادغام با Homie AI.",
          detail:
            "با آغاز همه‌گیری کووید-۱۹ و بسته شدن مرزهای چین، فصل جدیدی در کانادا آغاز شد. او با پذیرش دانشگاه مونترال وارد دومین دوره کارشناسی ارشد شد و همزمان استارتاپ Smart Immigration را با حمایت IVADO راه‌اندازی کرد. سپس Court AI را توسعه داد و این پروژه بعدها با Homie AI ادغام شد تا بستری جامع برای خدمات املاک، حقوقی و پرداخت‌های دیجیتال شکل بگیرد.",
        },
        {
          period: "Today",
          title: "از تجربه‌های جهانی تا تاسیس Elite Startup Visa",
          summary: "تمرکز نهایی: کمک به کارآفرینان برای ساخت کسب‌وکار جهانی و مهاجرت کارآفرینی.",
          detail:
            "در جریان توسعه Homie AI، ایده Apex Modular Construction نیز شکل گرفت. امروز حاصل سال‌ها تجربه تحصیلی، حقوقی، تجاری و فناورانه در یک ماموریت مشترک خلاصه شده است: کمک به کارآفرینان و نوآوران برای تبدیل ایده به کسب‌وکار بین‌المللی. بر همین اساس، Elite Startup Visa شکل گرفت؛ نه صرفا یک شرکت مهاجرتی، بلکه شریک راهبردی مسیر کارآفرینی جهانی.",
        },
      ];
    }

    return [
      {
        period: "2009-2013",
        title: "Legal Foundation and International Vision",
        summary: "Saeid began his legal studies while completing international arbitration and negotiation tracks.",
        detail:
          "He started law studies in 2009 and built a strong interdisciplinary base through international arbitration, negotiation, sociology, and multilingual training.",
      },
      {
        period: "2013-2015",
        title: "Strategic Shift to China",
        summary: "A key decision redirected his path from Europe to China.",
        detail:
          "He joined Xiamen University in 2013 as the first Iranian student in the master's track of Chinese civil and commercial law and graduated in 2015.",
      },
      {
        period: "After 2015",
        title: "Shanghai and Global Commercial Exposure",
        summary: "From elite admissions to real-world legal-commercial collaboration.",
        detail:
          "He selected Shanghai for its strategic economic ecosystem and actively contributed to legal-commercial cooperation between Iran and China.",
      },
      {
        period: "Today",
        title: "From Cross-Border Experience to Elite Startup Visa",
        summary: "A mission-driven platform for founders building global ventures.",
        detail:
          "His journey across education, law, trade, and AI-led startups converged into one mission: helping innovators scale globally through entrepreneurship-based immigration.",
      },
    ];
  }, [locale]);

  const companyQuestions = useMemo(() => {
    if (locale === "fa") {
      return [
        "چگونه وارد بازار کار شوم؟",
        "چگونه درآمد ایجاد کنم؟",
        "چگونه یک شبکه حرفه‌ای بسازم؟",
        "چگونه از تخصص و تجربه خود در کشور جدید استفاده کنم؟",
      ];
    }

    return [
      "How do I enter the job market?",
      "How do I generate income?",
      "How do I build a professional network?",
      "How can I use my expertise in a new country?",
    ];
  }, [locale]);

  const companySections = useMemo(() => {
    if (locale === "fa") {
      return [
        {
          title: "فراتر از مهاجرت؛ ساختن یک مسیر واقعی برای آینده",
          paragraphs: [
            "مهاجرت یکی از بزرگ‌ترین تصمیم‌های زندگی افراد است؛ تصمیمی که با امید به آینده‌ای بهتر، فرصت‌های جدید و رشد شخصی و حرفه‌ای همراه است. اما واقعیت این است که مهاجرت تنها با دریافت ویزا به پایان نمی‌رسد؛ بلکه از همان روز ورود به کشور جدید، چالش‌های اصلی آغاز می‌شوند.",
            "Elite Startup Visa با یک نگاه متفاوت به مفهوم مهاجرت کارآفرینی شکل گرفت. هدف ما تنها کمک به افراد برای عبور از فرآیند مهاجرت نیست؛ بلکه ایجاد یک مسیر مطمئن برای ورود به فضای کسب‌وکار و ساخت آینده حرفه‌ای در کشور مقصد است.",
          ],
        },
        {
          title: "یک مدل جدید در مهاجرت از طریق استارتاپ",
          paragraphs: [
            "در مدل سنتی، بسیاری از افراد پس از مهاجرت تازه شروع به جستجو برای پیدا کردن شغل یا ایجاد کسب‌وکار می‌کنند. این فرآیند ممکن است ماه‌ها یا حتی سال‌ها زمان ببرد.",
            "اما در Elite Startup Visa، متقاضیان پیش از مهاجرت وارد یک اکوسیستم واقعی کسب‌وکار می‌شوند. پروژه‌های ارائه‌شده صرفاً ایده‌های اولیه نیستند؛ بلکه پروژه‌های واقعی هستند که مسیر توسعه ایده، تحقیقات بازار، طراحی محصول، توسعه پلتفرم و آماده‌سازی ورود به بازار را طی کرده‌اند.",
            "افرادی که به این پروژه‌ها ملحق می‌شوند، علاوه بر مسیر مهاجرت، فرصت حضور در یک فعالیت تجاری واقعی را نیز خواهند داشت و پس از ورود می‌توانند در توسعه بازار، بازاریابی، فروش و رشد بین‌المللی این پروژه‌ها نقش فعال داشته باشند.",
          ],
        },
      ];
    }

    return [
      {
        title: "Beyond Immigration",
        paragraphs: [
          "Elite Startup Visa is built on the belief that immigration should lead to real economic integration, not just relocation.",
        ],
      },
      {
        title: "Startup-Centered Path",
        paragraphs: [
          "Applicants join active business projects before migration and continue their role in the destination market after arrival.",
        ],
      },
    ];
  }, [locale]);

  const companyBenefits = useMemo(() => {
    if (locale === "fa") {
      return [
        "پیش از مهاجرت با یک کسب‌وکار واقعی آشنا می‌شوید.",
        "تجربه کار در یک محیط بین‌المللی به دست می‌آورید.",
        "پس از ورود، به‌جای شروع از صفر، مسیر مشخص برای فعالیت دارید.",
        "شبکه تجاری خود را در کشور مقصد توسعه می‌دهید.",
        "از طریق توسعه بازار، فروش یا فعالیت تخصصی، فرصت درآمدزایی ایجاد می‌کنید.",
      ];
    }

    return [
      "Get exposure to a real business before migration.",
      "Gain international work experience.",
      "Start with a defined path instead of from zero.",
      "Grow your professional and business network.",
      "Create income opportunities through real contribution.",
    ];
  }, [locale]);

  const cooperationSteps = useMemo(() => {
    if (locale === "fa") {
      return [
        {
          title: "مرحله اول: بررسی توانایی‌ها و علایق فردی",
          description: "در ابتدا، سابقه کاری، مهارت‌ها، تجربیات و اهداف فرد بررسی می‌شود تا مناسب‌ترین پروژه انتخاب گردد.",
        },
        {
          title: "مرحله دوم: پیوستن به یک پروژه استارتاپی",
          description: "متقاضی به یکی از پروژه‌های فعال مجموعه متناسب با توانایی‌های خود ملحق می‌شود و با ساختار کسب‌وکار آشنا می‌گردد.",
        },
        {
          title: "مرحله سوم: توسعه مهارت و نقش تجاری",
          description: "فرد می‌تواند در بخش‌هایی مانند توسعه بازار، فروش، بازاریابی، مدیریت پروژه، فناوری یا توسعه کسب‌وکار فعالیت نماید.",
        },
        {
          title: "مرحله چهارم: ورود به بازار کشور مقصد",
          description: "پس از مهاجرت، فرد می‌تواند فعالیت‌های تجاری پروژه را در شهر یا کشور جدید توسعه دهد و بخشی از اکوسیستم جهانی آن کسب‌وکار باشد.",
        },
      ];
    }

    return [
      { title: "Step 1", description: "Profile and capability assessment." },
      { title: "Step 2", description: "Join a matching active startup project." },
      { title: "Step 3", description: "Build a clear commercial and professional role." },
      { title: "Step 4", description: "Expand activities in the destination market." },
    ];
  }, [locale]);

  const caseStudyBullets = useMemo(() => {
    if (locale === "fa") {
      return [
        "ایجاد ارتباط با سرمایه‌گذاران و صاحبان زمین",
        "برگزاری جلسات معرفی محصول",
        "همکاری با شرکت‌های گردشگری",
        "بازاریابی محلی",
        "توسعه شبکه فروش",
      ];
    }
    return [
      "Connect with landowners and investors",
      "Run product introduction sessions",
      "Partner with tourism operators",
      "Execute local marketing",
      "Build distribution channels",
    ];
  }, [locale]);

  return (
    <section id="about" className={styles.section}>
      <div className={styles.glowSpot} />

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65 }}
          className={styles.wrapper}
        >
          <div className={styles.topBar}>
            <div className={styles.badge}>
              <ShieldCheck size={16} />
              <span>{t.header.brandSub}</span>
            </div>
            <h2 className={styles.title}>{t.about.title}</h2>
            <p className={styles.subtitle}>{t.about.subtitle}</p>
          </div>

          <div className={styles.tabSwitch}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "founder" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("founder")}
            >
              <UserRound size={16} />
              <span>{locale === "fa" ? "درباره بنیان‌گذار" : "About Founder"}</span>
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === "company" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("company")}
            >
              <Building2 size={16} />
              <span>{locale === "fa" ? "درباره مجموعه" : "About Company"}</span>
            </button>
          </div>

          {activeTab === "founder" ? (
            <div className={styles.founderLayout}>
              <article className={styles.founderLeadCard}>
                <h3>{locale === "fa" ? "درباره بنیان‌گذار" : "About the Founder"}</h3>
                <p className={styles.leadEmphasis}>
                  {locale === "fa"
                    ? "گاهی یک تصمیم، می‌تواند مسیر تمام زندگی را تغییر دهد."
                    : "Sometimes, a single decision can redefine an entire life path."}
                </p>
                <p>
                  {locale === "fa"
                    ? "داستان Elite Startup Visa با یک تصمیم غیرمنتظره آغاز شد؛ تصمیمی که سعید شبانی را از یک شهر کوچک در ایران به مسیری بین‌المللی رساند."
                    : "Elite Startup Visa started with a pivotal decision that transformed Saeid Shabani's path into a truly international journey."}
                </p>
                <p>
                  {locale === "fa"
                    ? "مسیر او از حقوق و تجارت بین‌الملل تا ساخت استارتاپ‌های مبتنی بر AI، امروز به یک ماموریت مشترک ختم شده است: کمک به کارآفرینان برای ساخت کسب‌وکار جهانی."
                    : "His path across law, international trade, and AI startups converged into one mission: helping founders build global businesses."}
                </p>
              </article>

              <div className={styles.timelineList}>
                {founderMilestones.map((item, index) => (
                  <details key={index} className={styles.timelineItem} open={index === 0}>
                    <summary className={styles.timelineSummary}>
                      <span className={styles.timelinePeriod}>{item.period}</span>
                      <div className={styles.timelineHeading}>
                        <h4>{item.title}</h4>
                        <p>{item.summary}</p>
                      </div>
                    </summary>
                    <p className={styles.timelineDetail}>{item.detail}</p>
                  </details>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.companyLayout}>
              <div className={styles.companyStack}>
                <article className={styles.companyIntroCard}>
                  <h3>{locale === "fa" ? "درباره Elite Startup Visa" : "About Elite Startup Visa"}</h3>
                  <p className={styles.desc}>
                    {locale === "fa"
                      ? "هدف ما این است که افراد پس از مهاجرت تنها یک مهاجر جدید نباشند؛ بلکه عضوی از یک اکوسیستم اقتصادی باشند."
                      : "Our goal is to make founders part of a real economic ecosystem after migration."}
                  </p>
                  <div className={styles.questionList}>
                    {companyQuestions.map((question, index) => (
                      <span key={index} className={styles.questionItem}>
                        {question}
                      </span>
                    ))}
                  </div>
                </article>

                <div className={styles.companySections}>
                  {companySections.map((section, index) => (
                    <details key={index} className={styles.companySectionItem} open={index === 0}>
                      <summary className={styles.companySectionSummary}>{section.title}</summary>
                      <div className={styles.companySectionBody}>
                        {section.paragraphs.map((paragraph, pIndex) => (
                          <p key={pIndex} className={styles.desc}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>

                <article className={styles.companyText}>
                  <h4>{locale === "fa" ? "چگونه این مدل به شما کمک می‌کند؟" : "How This Model Helps You"}</h4>
                  <ul className={styles.companyBulletList}>
                    {companyBenefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </article>

                <article className={styles.companyText}>
                  <h4>{locale === "fa" ? "مراحل همکاری با Elite Startup Visa" : "Cooperation Stages"}</h4>
                  <div className={styles.processGrid}>
                    {cooperationSteps.map((step, index) => (
                      <div key={index} className={styles.processCard}>
                        <span className={styles.processIndex}>{index + 1}</span>
                        <h5>{step.title}</h5>
                        <p>{step.description}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className={styles.caseStudyCard}>
                  <h4>{locale === "fa" ? "Case Study: Apex Modular Construction" : "Case Study: Apex Modular Construction"}</h4>
                  <p className={styles.desc}>
                    {locale === "fa"
                      ? "فرض کنید فردی از طریق Apex مسیر مهاجرت خود را آغاز می‌کند. او پس از ورود به کشوری مانند پرتغال، تنها وارد یک کشور جدید نمی‌شود؛ بلکه یک فرصت تجاری مشخص در اختیار دارد."
                      : "A founder joining through Apex enters a destination market with a concrete commercial opportunity, not just a new location."}
                  </p>
                  <ul className={styles.companyBulletList}>
                    {caseStudyBullets.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                  <p className={styles.leadEmphasis}>
                    {locale === "fa"
                      ? "Elite Startup Visa؛ جایی که مهاجرت با ساختن آینده همراه می‌شود."
                      : "Elite Startup Visa, where immigration is tied to building your future."}
                  </p>
                </article>
              </div>

              <div className={styles.statsCol}>
                {t.about.stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45, delay: index * 0.1 }}
                    className={styles.statCard}
                  >
                    <span className={styles.statValue}>{stat.value}</span>
                    <span className={styles.statLabel}>{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
