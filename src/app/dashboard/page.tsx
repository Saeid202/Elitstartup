"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { ProjectsAdminPanel } from "@/components/admin/ProjectsAdminPanel";
import { CollaborationOpportunitiesAdminPanel } from "@/components/admin/CollaborationOpportunitiesAdminPanel";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Briefcase, 
  LayoutDashboard, 
  LogOut, 
  Save, 
  CheckCircle, 
  ExternalLink,
  Clock,
  Sparkles,
  Phone,
  Mail,
  FileText,
  Layers
} from "lucide-react";
import styles from "./dashboard.module.css";

type TabType = "overview" | "profile" | "projects" | "adminProjects" | "adminOpportunities";

interface UserInterest {
  id: string;
  project_id: string;
  project_title: string;
  role: string;
  message: string;
  created_at: string;
}

export default function DashboardPage() {
  const { locale, dir } = useLanguage();
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    phone: "",
    bio: ""
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [userInterests, setUserInterests] = useState<UserInterest[]>([]);
  const [loadingInterests, setLoadingInterests] = useState(false);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/dashboard&message=auth-required");
    }
  }, [user, loading, router]);

  // Sync profile form state
  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.full_name || "",
        phone: profile.phone || "",
        bio: profile.bio || ""
      });
    }
  }, [profile]);

  // Fetch registered interests
  const fetchInterests = async () => {
    if (!user) return;
    setLoadingInterests(true);
    try {
      const { data, error } = await supabase
        .from("user_interests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setUserInterests(data);
      }
    } catch (err) {
      console.error("Error fetching interests:", err);
    } finally {
      setLoadingInterests(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === "projects") {
      fetchInterests();
    }
  }, [user, activeTab]);

  // Trigger initial fetch of interests for dashboard overview tab counter
  useEffect(() => {
    if (user) {
      fetchInterests();
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    setSaveSuccess(false);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: profileForm.fullName,
          phone: profileForm.phone,
          bio: profileForm.bio,
          email: user.email,
          updated_at: new Date().toISOString()
        });

      if (!error) {
        await refreshProfile();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        console.error("Error updating profile:", error.message);
      }
    } catch (err) {
      console.error("Unexpected error saving profile:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (loading || !user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "var(--primary-bg)" }}>
        <span className={styles.spinner} style={{ width: "40px", height: "40px" }}></span>
      </div>
    );
  }

  const userDisplayName = profile?.full_name || user.email?.split("@")[0] || "User";
  const isAdmin = profile?.is_admin === true;

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.glowSpot} />
        <div className={styles.glowSpot2} />

        <div className={styles.container}>
          <div className={styles.dashboardLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <User size={32} />
                </div>
                <div className={styles.userDetails}>
                  <h3 className={styles.userName}>{userDisplayName}</h3>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
              </div>

              <nav className={styles.menu}>
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`${styles.menuItem} ${activeTab === "overview" ? styles.active : ""}`}
                >
                  <LayoutDashboard size={20} />
                  <span>{locale === "fa" ? "داشبورد" : "Dashboard"}</span>
                </button>

                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`${styles.menuItem} ${activeTab === "profile" ? styles.active : ""}`}
                >
                  <User size={20} />
                  <span>{locale === "fa" ? "پروفایل کاربری" : "User Profile"}</span>
                </button>

                <button 
                  onClick={() => setActiveTab("projects")}
                  className={`${styles.menuItem} ${activeTab === "projects" ? styles.active : ""}`}
                >
                  <Briefcase size={20} />
                  <span>{locale === "fa" ? "پروژه‌های شما" : "Your Projects"}</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setActiveTab("adminProjects")}
                    className={`${styles.menuItem} ${activeTab === "adminProjects" ? styles.active : ""}`}
                  >
                    <Briefcase size={20} />
                    <span>{locale === "fa" ? "مدیریت پروژه ها" : "Projects Admin"}</span>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => setActiveTab("adminOpportunities")}
                    className={`${styles.menuItem} ${activeTab === "adminOpportunities" ? styles.active : ""}`}
                  >
                    <Layers size={20} />
                    <span>{locale === "fa" ? "مدیریت فرصت های همکاری" : "Opportunities Admin"}</span>
                  </button>
                )}

                <button onClick={signOut} className={`${styles.menuItem} ${styles.logoutBtn}`}>
                  <LogOut size={20} />
                  <span>{locale === "fa" ? "خروج از حساب" : "Log Out"}</span>
                </button>
              </nav>
            </aside>

            {/* Main Content Area */}
            <section className={styles.contentArea}>
              <AnimatePresence mode="wait">
                {/* 1. Overview Tab */}
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.tabContent}
                  >
                    <div className={styles.welcomeBanner}>
                      <div className={styles.welcomeInfo}>
                        <h2>
                          {locale === "fa" ? `${userDisplayName} عزیز، خوش آمدید!` : `Welcome, ${userDisplayName}!`}
                        </h2>
                        <p>
                          {locale === "fa"
                            ? "از پنل کاربری خود می‌توانید اطلاعات پروفایل را تکمیل کرده و پروژه‌های خود را مدیریت کنید."
                            : "From your panel you can complete your profile information and manage your projects."}
                        </p>
                      </div>
                      <div className={styles.welcomeIcon}>
                        <Sparkles size={40} />
                      </div>
                    </div>

                    <div className={styles.statsGrid}>
                      <div className={styles.statCard}>
                        <h4>{locale === "fa" ? "وضعیت پروفایل" : "Profile Status"}</h4>
                        <p className={profile?.full_name ? styles.statusComplete : styles.statusIncomplete}>
                          {profile?.full_name 
                            ? (locale === "fa" ? "تکمیل شده" : "Complete") 
                            : (locale === "fa" ? "ناقص (نیاز به تکمیل)" : "Incomplete")}
                        </p>
                      </div>
                      <div className={styles.statCard}>
                        <h4>{locale === "fa" ? "تعداد پروژه‌های ثبت‌شده" : "Applied Projects"}</h4>
                        <p className={styles.statNum}>{userInterests.length}</p>
                      </div>
                      <div className={styles.statCard}>
                        <h4>{locale === "fa" ? "آخرین فعالیت" : "Last Update"}</h4>
                        <p className={styles.statVal}>
                          {profile?.updated_at 
                            ? new Date(profile.updated_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")
                            : (locale === "fa" ? "ثبت نشده" : "Never")}
                        </p>
                      </div>
                    </div>

                    <div className={styles.recentPanel}>
                      <h3>{locale === "fa" ? "بررسی علاقه‌مندی‌ها" : "Application Status"}</h3>
                      {userInterests.length === 0 ? (
                        <div className={styles.emptyOverview}>
                          <p>
                            {locale === "fa"
                              ? "هنوز در هیچ پروژه‌ای ثبت علاقه‌مندی نکرده‌اید."
                              : "You haven't applied for any project collaboration yet."}
                          </p>
                          <button onClick={() => router.push("/projects")} className={styles.browseBtn}>
                            <span>{locale === "fa" ? "مشاهده استارتاپ‌ها" : "Browse Projects"}</span>
                            <ExternalLink size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.timelineList}>
                          {userInterests.slice(0, 3).map(interest => (
                            <div key={interest.id} className={styles.timelineItem}>
                              <div className={styles.timelineBullet} />
                              <div className={styles.timelineInfo}>
                                <h4>{interest.project_title}</h4>
                                <span className={styles.timelineRole}>
                                  {locale === "fa" ? "نقش درخواستی:" : "Role:"} {interest.role}
                                </span>
                                <span className={styles.timelineDate}>
                                  <Clock size={12} />
                                  {new Date(interest.created_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
                                </span>
                              </div>
                              <span className={styles.statusBadge}>
                                {locale === "fa" ? "در حال بررسی" : "Under Review"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 2. Profile Tab */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.tabContent}
                  >
                    <div className={styles.cardHeader}>
                      <h2>{locale === "fa" ? "پروفایل کاربری" : "User Profile"}</h2>
                      <p>{locale === "fa" ? "اطلاعات تکمیلی خود را برای ارزیابی پرونده‌ها وارد کنید" : "Enter your additional information for profile evaluation"}</p>
                    </div>

                    {saveSuccess && (
                      <div className={styles.successMessage}>
                        <CheckCircle size={18} />
                        <span>{locale === "fa" ? "تغییرات با موفقیت ذخیره شد." : "Changes saved successfully."}</span>
                      </div>
                    )}

                    <form onSubmit={handleSaveProfile} className={styles.profileForm}>
                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label htmlFor="fullName">{locale === "fa" ? "نام و نام خانوادگی" : "Full Name"}</label>
                          <div className={styles.inputWrapper}>
                            <User className={styles.inputIcon} size={20} />
                            <input
                              type="text"
                              id="fullName"
                              name="fullName"
                              required
                              value={profileForm.fullName}
                              onChange={handleProfileChange}
                              placeholder={locale === "fa" ? "مثال: علی احمدی" : "e.g. John Doe"}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="phone">{locale === "fa" ? "شماره تماس (واتس‌اپ)" : "Phone Number (WhatsApp)"}</label>
                          <div className={styles.inputWrapper}>
                            <Phone className={styles.inputIcon} size={20} />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              required
                              value={profileForm.phone}
                              onChange={handleProfileChange}
                              placeholder={locale === "fa" ? "مثال: 09123456789" : "e.g. +1234567890"}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                          <label>{locale === "fa" ? "ایمیل (غیر قابل تغییر)" : "Email Address (Read-only)"}</label>
                          <div className={styles.inputWrapper} style={{ opacity: 0.6 }}>
                            <Mail className={styles.inputIcon} size={20} />
                            <input
                              type="email"
                              readOnly
                              value={user.email || ""}
                              style={{ cursor: "not-allowed" }}
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                          <label htmlFor="bio">{locale === "fa" ? "بیوگرافی و خلاصه سوابق" : "Bio and Short Resume"}</label>
                          <div className={styles.inputWrapper}>
                            <FileText className={styles.inputIcon} style={{ top: "1.2rem" }} size={20} />
                            <textarea
                              id="bio"
                              name="bio"
                              rows={5}
                              value={profileForm.bio}
                              onChange={handleProfileChange}
                              placeholder={locale === "fa" ? "توضیح مختصری درباره تحصیلات، مهارت‌ها و تجارب شغلی خود بنویسید..." : "Write a brief description about your education, skills, and work experience..."}
                            />
                          </div>
                        </div>
                      </div>

                      <button type="submit" disabled={isSavingProfile} className={styles.saveBtn}>
                        {isSavingProfile ? (
                          <span className={styles.spinner}></span>
                        ) : (
                          <>
                            <span>{locale === "fa" ? "ذخیره تغییرات" : "Save Changes"}</span>
                            <Save size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* 3. Projects Tab */}
                {activeTab === "projects" && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.tabContent}
                  >
                    <div className={styles.cardHeader}>
                      <h2>{locale === "fa" ? "پروژه‌های شما" : "Your Projects"}</h2>
                      <p>
                        {locale === "fa" 
                          ? "لیست پروژه‌هایی که در آن‌ها ثبت علاقه‌مندی یا درخواست هم‌بنیان‌گذاری کرده‌اید" 
                          : "List of projects where you have registered your interest or requested co-foundership"}
                      </p>
                    </div>

                    {loadingInterests ? (
                      <div className={styles.interestsSpinner}>
                        <span className={styles.spinner}></span>
                      </div>
                    ) : userInterests.length === 0 ? (
                      <div className={styles.emptyOverview} style={{ padding: "4rem 2rem" }}>
                        <p>
                          {locale === "fa"
                            ? "هنوز در هیچ پروژه‌ای ثبت علاقه‌مندی نکرده‌اید."
                            : "You haven't registered your interest in any projects yet."}
                        </p>
                        <button onClick={() => router.push("/projects")} className={styles.browseBtn}>
                          <span>{locale === "fa" ? "مشاهده و انتخاب پروژه‌ها" : "Browse Projects"}</span>
                          <ExternalLink size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className={styles.interestsGrid}>
                        {userInterests.map(interest => (
                          <div key={interest.id} className={styles.interestCard}>
                            <div className={styles.interestHeader}>
                              <h3>{interest.project_title}</h3>
                              <span className={styles.badgeUnderReview}>
                                {locale === "fa" ? "در حال بررسی" : "Under Review"}
                              </span>
                            </div>
                            
                            <div className={styles.interestMeta}>
                              <div className={styles.metaRow}>
                                <strong>{locale === "fa" ? "نقش درخواستی:" : "Role Applied:"}</strong>
                                <span>{interest.role}</span>
                              </div>
                              <div className={styles.metaRow}>
                                <strong>{locale === "fa" ? "تاریخ ثبت:" : "Date Submitted:"}</strong>
                                <span>{new Date(interest.created_at).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}</span>
                              </div>
                            </div>

                            {interest.message && (
                              <div className={styles.interestMessage}>
                                <h5>{locale === "fa" ? "توضیحات شما:" : "Your Message:"}</h5>
                                <p>{interest.message}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "adminProjects" && isAdmin && (
                  <motion.div
                    key="admin-projects"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.tabContent}
                  >
                    <ProjectsAdminPanel locale={locale} />
                  </motion.div>
                )}

                {activeTab === "adminOpportunities" && isAdmin && (
                  <motion.div
                    key="admin-opportunities"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={styles.tabContent}
                  >
                    <CollaborationOpportunitiesAdminPanel locale={locale} />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
