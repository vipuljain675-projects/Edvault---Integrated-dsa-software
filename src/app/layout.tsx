import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import SessionProvider from "@/components/auth/SessionProvider";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  metadataBase: new URL("https://edvault-integrated-dsa-software.vercel.app"),
  title: {
    default: "EduVault — Master DSA & Full Stack Engineering",
    template: "%s | EduVault",
  },
  description:
    "Learn Data Structures & Algorithms systematically, track daily streaks, sync with LeetCode, and get feedback from Sensei (AI Tutor). Built for student placement prep.",
  keywords: ["DSA sheet", "LeetCode sync", "AI tutor", "Placement prep", "nextjs", "bot detection", "learning path"],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "EduVault — Master DSA & Full Stack Engineering",
    description: "Learn DSA systematically, track daily streaks, sync with LeetCode, and get feedback from Sensei (AI Tutor).",
    url: "https://edvault-integrated-dsa-software.vercel.app",
    siteName: "EduVault",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduVault — Master DSA & Full Stack Engineering",
    description: "Learn DSA systematically, track daily streaks, sync with LeetCode, and get feedback from Sensei (AI Tutor).",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body className="grain">
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-default)",
                borderRadius: "var(--radius-md)",
                fontFamily: "var(--font-body)",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "white" },
              },
              error: {
                iconTheme: { primary: "#EF4444", secondary: "white" },
              },
            }}
          />
          <Analytics />
        </SessionProvider>
      </body>
    </html>
  );
}
