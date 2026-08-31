import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { NotificationProvider } from "@/components/NotificationProvider";

export const metadata: Metadata = {
  title: "FreshFind | Food Rescue Marketplace Kigali",
  description: "Rescue delicious surplus food bags from Kigali bakeries, cafes, and restaurants at up to 70% off.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FreshFind",
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200 antialiased selection:bg-emerald-500 selection:text-slate-950">
        <AppProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
