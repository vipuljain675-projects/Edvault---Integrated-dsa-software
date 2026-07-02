import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SessionProvider from "@/components/auth/SessionProvider";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "EduVault — Learn What the Industry Actually Needs",
    template: "%s | EduVault",
  },
  description:
    "Master DSA, Machine Learning, and Full Stack Engineering with structured paths, AI-powered tutoring, and real-world projects. Built for college students who want to get hired.",
  keywords: ["edtech", "DSA", "machine learning", "full stack", "online learning", "coding", "programming"],
  openGraph: {
    title: "EduVault",
    description: "Learn DSA, ML & Full Stack the right way.",
    type: "website",
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
        </SessionProvider>
      </body>
    </html>
  );
}
