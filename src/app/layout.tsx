import type { Metadata } from "next";
import { Vazirmatn, Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elite Startup Visa | الیت استارتاپ ویزا",
  description: "خدمات تخصصی توسعه استارتاپ و اخذ ویزای استارتاپ بین‌المللی - از ایده تا اقامت دائم | Premium International Startup Visa Solutions",
  keywords: ["استارتاپ ویزا", "مهاجرت استارتاپی", "ویزای کار", "اقامت دائم", "شتاب دهنده بین المللی", "International Startup Visa", "Startup Program"],
  icons: {
    icon: "/elite-logo.png",
    apple: "/elite-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <html 
        lang="fa" 
        dir="rtl" 
        className={`${vazirmatn.variable} ${outfit.variable} ${playfair.variable}`}
        suppressHydrationWarning
      >
        <body suppressHydrationWarning>
          <AuthProvider>
            {children}
          </AuthProvider>
        </body>
      </html>
    </LanguageProvider>
  );
}
