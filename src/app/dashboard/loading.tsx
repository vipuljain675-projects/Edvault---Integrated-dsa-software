"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PATH_MAP: Record<string, string> = {
  "/dashboard": "Entering dashboard...",
  "/dashboard/dsa": "Preparing DSA sheets...",
  "/dashboard/leaderboard": "Loading global leaderboard...",
  "/dashboard/roadmap": "Connecting with Sensei...",
  "/dashboard/lobbies": "Entering lobbies area...",
  "/dashboard/analytics": "Crunching your analytics...",
  "/dashboard/profile": "Loading profile details...",
  "/dashboard/settings": "Loading settings...",
};

export default function DashboardLoading() {
  const pathname = usePathname();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    if (!pathname) return;
    // Sort keys by descending length to match more specific routes first (e.g. /dashboard/dsa before /dashboard)
    const match = Object.keys(PATH_MAP)
      .sort((a, b) => b.length - a.length)
      .find((key) => pathname.startsWith(key));
    setMessage(match ? PATH_MAP[match] : "Loading area...");
  }, [pathname]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 180px)",
      width: "100%",
      background: "transparent",
      gap: "1.2rem",
    }}>
      {/* Premium Rotating Circle Loader */}
      <div className="premium-spinner-ring" />

      {/* Dynamic message with fade-pulse animation */}
      <div style={{
        fontSize: "0.92rem",
        fontWeight: 500,
        color: "var(--text-secondary)",
        letterSpacing: "0.02em",
        animation: "pulse-text 1.8s ease-in-out infinite",
      }}>
        {message}
      </div>

      <style>{`
        .premium-spinner-ring {
          width: 44px;
          height: 44px;
          border: 3.5px solid rgba(99, 102, 241, 0.12);
          border-top: 3.5px solid #6366F1;
          border-radius: 50%;
          animation: spin-loader 0.85s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes spin-loader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
