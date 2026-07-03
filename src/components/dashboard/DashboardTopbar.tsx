"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, LogOut, Settings, Award, Flame, Coins, RefreshCw } from "lucide-react";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Props {
  user: {
    name?: string;
    email?: string;
    image?: string;
    xp?: number;
    level?: number;
    streak?: number;
    leetcodeUsername?: string | null;
  };
}

export default function DashboardTopbar({ user: initialUser }: Props) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Live stats — always fetched fresh from the DB
  const [liveStats, setLiveStats] = useState({
    xp: initialUser.xp ?? 0,
    level: initialUser.level ?? 1,
    streak: initialUser.streak ?? 0,
    leetcodeUsername: initialUser.leetcodeUsername ?? null,
  });

  // Fetch fresh stats from the server
  const refreshStats = useCallback(async () => {
    try {
      const res = await fetch("/api/user/stats", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLiveStats({
          xp: data.xp ?? 0,
          level: data.level ?? 1,
          streak: data.streak ?? 0,
          leetcodeUsername: data.leetcodeUsername ?? null,
        });
      }
    } catch {
      // silently fail — keep existing values
    }
  }, []);

  // Fetch on mount and whenever the route changes (navigating between pages)
  useEffect(() => {
    refreshStats();
  }, [pathname, refreshStats]);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSync = async () => {
    if (!liveStats.leetcodeUsername) {
      toast.error("Please link your LeetCode username in Settings first!");
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch("/api/leetcode/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to sync");

      toast.success(
        data.newlySynced > 0
          ? `Synced! Added ${data.newlySynced} new solves. +${data.xpAwarded} XP ✨`
          : "Already up to date! 👍"
      );
      // Refresh topbar stats after sync
      await refreshStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to sync LeetCode solves");
    } finally {
      setSyncing(false);
    }
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.startsWith("/dashboard/analytics")) return "Analytics";
    if (pathname.startsWith("/dashboard/dsa")) return "DSA Sheets";
    if (pathname.startsWith("/dashboard/leaderboard")) return "Leaderboard";
    if (pathname.startsWith("/dashboard/roadmap")) return "Sensei";
    if (pathname.startsWith("/dashboard/lobbies")) return "Lobbies";
    if (pathname.startsWith("/dashboard/flashcards")) return "Flashcards";
    if (pathname.startsWith("/dashboard/profile")) return "Profile";
    if (pathname.startsWith("/dashboard/settings")) return "Settings";
    return "Dashboard";
  };

  const notifications = [
    { id: 1, text: "Welcome to EduVault! Let's start practicing DSA.", time: "1h ago" },
    { id: 2, text: "Supabase PostgreSQL database is connected and active.", time: "3h ago" },
    { id: 3, text: "Google OAuth credentials loaded successfully.", time: "1d ago" },
  ];

  const initials = initialUser.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
  const userCoins = Math.floor(liveStats.xp / 10);

  return (
    <header className="topbar" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.85rem 1.75rem",
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border-subtle)",
      position: "relative",
      zIndex: 50,
      gap: "2rem",
      minHeight: "68px"
    }}>
      {/* Left: Dynamic Title */}
      <div style={{ minWidth: 180 }}>
        <h1 style={{
          fontSize: "1.35rem",
          fontWeight: 800,
          color: "var(--text-primary)",
          fontFamily: "var(--font-display)",
          margin: 0
        }}>
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Stats pills & Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto", flexWrap: "wrap", justifyContent: "flex-end" }}>
        
        <div className="topbar-stat-pill" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.07)", color: "#EF4444" }}>
          <span className="pill-icon" style={{ background: "rgba(239,68,68,0.15)", color: "#EF4444" }}>
            <Flame size={13} fill="#EF4444" strokeWidth={2} />
          </span>
          <span>{liveStats.streak} Streak</span>
        </div>

        <div className="topbar-stat-pill">
          <span className="pill-icon" style={{ background: "rgba(99,102,241,0.14)", color: "#6366F1" }}>
            <Award size={13} strokeWidth={2.5} />
          </span>
          <span>Level {liveStats.level}</span>
        </div>

        <div className="topbar-stat-pill" style={{ borderColor: "rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.07)", color: "#D97706" }}>
          <span className="pill-icon" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
            <Coins size={13} fill="#F59E0B" strokeWidth={2} />
          </span>
          <span>{userCoins} Coins</span>
        </div>

        {/* PRO Pill */}
        <div style={{
          background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
          color: "#FFFFFF",
          fontSize: "0.68rem",
          fontWeight: 800,
          padding: "0.2rem 0.55rem",
          borderRadius: "6px",
          letterSpacing: "0.05em",
          boxShadow: "0 2px 6px rgba(245, 158, 11, 0.25)"
        }}>
          PRO
        </div>

        {/* Invite Friend Button */}
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin);
            toast.success("Invite link copied to clipboard! 🚀");
          }}
          className="btn btn-secondary btn-sm"
          style={{
            minHeight: 36,
            padding: "0.45rem 0.95rem",
            fontSize: "0.78rem",
            fontWeight: 700,
            borderRadius: "999px",
            border: "1px solid var(--border-subtle)",
            background: "var(--bg-surface)",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Invite Friend
        </button>

        {/* Sync Refresh Button */}
        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-subtle)",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            cursor: syncing ? "not-allowed" : "pointer",
            transition: "all 0.2s"
          }}
          className="collapse-btn"
          title="Sync LeetCode"
        >
          <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
        </button>

        {/* Notifications Button & Dropdown */}
        <div ref={notificationRef} style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "50%",
              width: 36, height: 36,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              cursor: "pointer", color: "var(--text-muted)",
              transition: "all 0.2s",
            }}
            className="collapse-btn"
          >
            <Bell size={16} />
            <div style={{
              position: "absolute",
              top: 8, right: 8,
              width: 6, height: 6,
              background: "#EF4444",
              borderRadius: "50%",
              border: "1.5px solid var(--bg-surface)",
            }} />
          </button>

          {showNotifications && (
            <div className="glass" style={{
              position: "absolute",
              right: 0,
              top: "44px",
              width: "280px",
              borderRadius: "var(--radius-md)",
              padding: "1rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              border: "1px solid var(--border-default)",
            }}>
              <div style={{ fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.75rem", color: "var(--text-primary)" }}>
                Notifications
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ fontSize: "0.78rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.5rem" }}>
                    <div style={{ color: "var(--text-secondary)", marginBottom: "0.2rem" }}>{n.text}</div>
                    <div style={{ fontSize: "0.68rem", color: "var(--text-disabled)" }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Button & Dropdown */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <div
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              width: 36, height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 700, color: "white",
              cursor: "pointer",
              border: "2px solid var(--border-default)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {initialUser.image
              ? <img src={initialUser.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : initials
            }
          </div>

          {showProfileDropdown && (
            <div className="glass" style={{
              position: "absolute",
              right: 0,
              top: "44px",
              width: "200px",
              borderRadius: "var(--radius-md)",
              padding: "0.75rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              border: "1px solid var(--border-default)",
            }}>
              <div style={{ padding: "0.25rem 0.5rem 0.5rem", borderBottom: "1px solid var(--border-subtle)", marginBottom: "0.5rem" }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>
                  {initialUser.name || "Student"}
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {initialUser.email}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <Link href="/dashboard/profile" className="sidebar-nav-item" style={{ padding: "0.4rem 0.5rem", fontSize: "0.8rem" }}>
                  Profile
                </Link>
                <Link href="/dashboard/settings" className="sidebar-nav-item" style={{ padding: "0.4rem 0.5rem", fontSize: "0.8rem" }}>
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="sidebar-nav-item"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.4rem 0.5rem",
                    fontSize: "0.8rem",
                    color: "#EF4444"
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
