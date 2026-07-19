"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import styles from "../login/auth.module.css";

export default function SignUpPage() {
  const { locale, dir } = useLanguage();
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // 1. Sign up user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      });

      if (authError) {
        setErrorMsg(authError.message);
        setIsSubmitting(false);
        return;
      }

      if (authData.user) {
        // Insert profile only when signup returns an active session.
        // If email confirmation is required, user is not authenticated yet and RLS can block this insert.
        if (authData.session?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert(
              {
                id: authData.user.id,
                full_name: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                bio: ""
              },
              { onConflict: "id" }
            );

          if (profileError) {
            console.error("Error creating profile record:", {
              message: profileError.message,
              details: profileError.details,
              hint: profileError.hint,
              code: profileError.code
            });
            // Don't block signup if profile upsert fails, AuthContext has a fallback.
          }
        }

        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login?message=signup-success");
        }, 2000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during Google sign in.");
    }
  };

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.glowSpot} />
        <div className={styles.glowSpot2} />

        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.authCard}
          >
            <h1 className={styles.title}>
              {locale === "fa" ? "ایجاد حساب کاربری" : "Create Account"}
            </h1>
            <p className={styles.subtitle}>
              {locale === "fa" 
                ? "به الیت استارتاپ بپیوندید و فرصت‌های همکاری را دنبال کنید" 
                : "Join Elite Startup and track your collaboration opportunities"}
            </p>

            {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
            {isSuccess && (
              <div className={styles.successAlert}>
                {locale === "fa"
                  ? "ثبت‌نام با موفقیت انجام شد! در حال انتقال به صفحه ورود..."
                  : "Registration successful! Redirecting to login page..."}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>{locale === "fa" ? "نام و نام خانوادگی" : "Full Name"}</label>
                <div className={styles.inputWrapper}>
                  <User className={styles.inputIcon} size={20} />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={locale === "fa" ? "مثال: علی احمدی" : "e.g. John Doe"}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{locale === "fa" ? "شماره تماس (واتس‌اپ)" : "Phone Number (WhatsApp)"}</label>
                <div className={styles.inputWrapper}>
                  <Phone className={styles.inputIcon} size={20} />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={locale === "fa" ? "مثال: 09123456789" : "e.g. +1234567890"}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{locale === "fa" ? "ایمیل" : "Email Address"}</label>
                <div className={styles.inputWrapper}>
                  <Mail className={styles.inputIcon} size={20} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>{locale === "fa" ? "رمز عبور" : "Password"}</label>
                <div className={styles.inputWrapper}>
                  <Lock className={styles.inputIcon} size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="******"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting || isSuccess} className={styles.submitBtn}>
                {isSubmitting ? (
                  <span className={styles.spinner}></span>
                ) : (
                  <span>{locale === "fa" ? "ثبت‌نام و ایجاد حساب" : "Sign Up and Create Account"}</span>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>{locale === "fa" ? "یا" : "or"}</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className={styles.googleBtn}
            >
              <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
                <path
                  fill="#EA4335"
                  d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.37 0 3.39 2.673 1.5 6.57l3.766 3.195z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.275c0-.825-.075-1.62-.215-2.385H12v4.51h6.47c-.28 1.48-1.12 2.73-2.38 3.58l3.71 2.88c2.16-2 3.42-4.935 3.42-8.585z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.266 14.235A7.16 7.16 0 0 1 4.909 12c0-.79.13-1.55.357-2.265L1.5 6.54A11.96 11.96 0 0 0 0 12c0 2.02.5 3.92 1.39 5.61l3.876-3.375z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.97-1.075 7.96-2.915l-3.71-2.88c-1.03.69-2.34 1.105-3.95 1.105-3.037 0-5.61-2.05-6.527-4.815L2.007 17.8C3.89 21.68 7.87 24 12 24z"
                />
              </svg>
              <span>{locale === "fa" ? "ثبت‌نام با گوگل" : "Sign up with Google"}</span>
            </button>

            <div className={styles.footerLink}>
              {locale === "fa" ? (
                <span>
                  قبلاً حساب کاربری ساخته‌اید؟{" "}
                  <Link href="/login" className={styles.linkText}>
                    وارد شوید
                  </Link>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <Link href="/login" className={styles.linkText}>
                    Log In
                  </Link>
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
