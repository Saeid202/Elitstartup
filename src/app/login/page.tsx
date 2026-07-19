"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import styles from "./auth.module.css";

function LoginForm() {
  const { locale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/dashboard";
  const messageParam = searchParams.get("message");
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, redirect
  React.useEffect(() => {
    if (user) {
      router.push(redirectPath);
    }
  }, [user, router, redirectPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        setErrorMsg(error.message);
        setIsSubmitting(false);
        return;
      }

      router.push(redirectPath);
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
          redirectTo: `${window.location.origin}${redirectPath}`
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={styles.authCard}
    >
      <h1 className={styles.title}>
        {locale === "fa" ? "ورود به حساب کاربری" : "Log In"}
      </h1>
      <p className={styles.subtitle}>
        {locale === "fa" 
          ? "وارد حساب خود شوید تا فرصت‌های همکاری را ثبت و مدیریت کنید" 
          : "Log in to apply for and manage your collaboration opportunities"}
      </p>

      {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
      {messageParam === "signup-success" && (
        <div className={styles.infoAlert}>
          {locale === "fa"
            ? "ثبت‌نام با موفقیت انجام شد! اکنون می‌توانید وارد حساب خود شوید."
            : "Sign up successful! You can now log in to your account."}
        </div>
      )}
      {messageParam === "auth-required" && (
        <div className={styles.infoAlert}>
          {locale === "fa"
            ? "برای ثبت علاقه‌مندی ابتدا باید وارد حساب کاربری خود شوید."
            : "Please log in first to register your interest."}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
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

        <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
          {isSubmitting ? (
            <span className={styles.spinner}></span>
          ) : (
            <span>{locale === "fa" ? "ورود به حساب کاربری" : "Log In"}</span>
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
        <span>{locale === "fa" ? "ورود با گوگل" : "Sign in with Google"}</span>
      </button>

      <div className={styles.footerLink}>
        {locale === "fa" ? (
          <span>
            هنوز حساب کاربری ندارید؟{" "}
            <Link href="/signup" className={styles.linkText}>
              ثبت‌نام کنید
            </Link>
          </span>
        ) : (
          <span>
            Don't have an account?{" "}
            <Link href="/signup" className={styles.linkText}>
              Sign Up
            </Link>
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.glowSpot} />
        <div className={styles.glowSpot2} />

        <div className={styles.container}>
          <Suspense fallback={
            <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
              <span className={styles.spinner}></span>
            </div>
          }>
            <LoginForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </>
  );
}
