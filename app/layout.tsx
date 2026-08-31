import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { NotificationProvider } from "@/components/NotificationProvider";

export const metadata: Metadata = {
  title: "FreshFind | Food Rescue Marketplace",
  description: "Rescue delicious surplus food bags from Kigali bakeries, cafes, and restaurants at up to 70% off.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-200">
        <AppProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
