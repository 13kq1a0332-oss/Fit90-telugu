import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { Locale } from "@/types/database.types";
import { PwaRegister } from "@/components/pwa/pwa-register";

export const metadata: Metadata = {
  title: "Fit90 Telugu - స్థిరమైన బరువు నిర్వహణ & ఆరోగ్య ట్రాకర్",
  description: "90-Day Sustainable Weight Loss and Lifestyle Tracking PWA in Telugu and English. Balanced Indian nutrition, low-impact exercise progression, and private health metrics.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fit90 Telugu",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const savedLocale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "te";

  return (
    <html lang={savedLocale} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <I18nProvider initialLocale={savedLocale}>
          {children}
          <PwaRegister />
        </I18nProvider>
      </body>
    </html>
  );
}

