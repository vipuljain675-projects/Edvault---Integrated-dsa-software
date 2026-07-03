"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, BarChart2, User,
  GraduationCap, Settings, LogOut, Brain, Flame,
  Users, Layers, Zap, Sun, Moon, Trophy, Bot
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "#6366F1", bg: "rgba(99,102,241,0.15)" },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics", color: "#06B6D4", bg: "rgba(6,182,212,0.15)" },
  { href: "/dashboard/dsa", icon: Zap, label: "DSA Sheets", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  { href: "/dashboard/leaderboard", icon: Trophy, label: "Leaderboard", color: "#8B5CF6", bg: "rgba(139,92,246,0.15)" },
  { href: "/dashboard/roadmap", icon: Bot, label: "Sensei", color: "#6366F1", bg: "rgba(99,102,241,0.15)" },
];

const exploreItems = [
  { href: "/dashboard/lobbies", icon: Users, label: "Lobbies", color: "#10B981", bg: "rgba(16,185,129,0.15)" },
  { href: "/dashboard/flashcards", icon: Layers, label: "Flashcards", color: "#EC4899", bg: "rgba(236,72,153,0.15)" },
];

function NavIcon({ Icon, color, bg }: { Icon: typeof LayoutDashboard; color: string; bg: string }) {
  return (
    <span className="nav-icon-wrap" style={{ background: bg, color }}>
      <Icon size={18} strokeWidth={2.25} />
    </span>
  );
}

interface Props {
  user: { name?: string; email?: string; image?: string; xp?: number; level?: number; streak?: number; role?: string };
}

export default function DashboardSidebar({ user }: Props) {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [theme, setTheme] = useState("dark");

  // Load theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    const rootEl = document.getElementById("dashboard-root");
    if (rootEl) {
      rootEl.className = savedTheme === "light" ? "dashboard-light" : "dashboard-dark";
    }
  }, []);

  const handleThemeToggle = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    const rootEl = document.getElementById("dashboard-root");
    if (rootEl) {
      rootEl.className = nextTheme === "light" ? "dashboard-light" : "dashboard-dark";
    }
  };

  const getLevelName = (level: number = 1) => {
    const levels = ["Beginner", "Explorer", "Scholar", "Expert", "Legend"];
    return levels[Math.min(level - 1, 4)];
  };

  const initials = user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";

  return (
    <aside
      className={`sidebar ${!isHovered ? "collapsed" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isHovered ? "260px" : "78px",
        position: "relative",
        height: "100vh",
        flexShrink: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isHovered ? "4px 0 20px rgba(0, 0, 0, 0.15)" : "none",
        overflowX: "hidden"
      }}
    >
      {/* Logo Section */}
      <div style={{
        padding: isHovered ? "0 1.25rem 1.5rem" : "0 0 1.5rem",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: isHovered ? "flex-start" : "center",
        minHeight: "50px",
        width: "100%"
      }}>
        {isHovered ? (
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
            <div style={{
              width: 34, height: 34,
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <GraduationCap size={18} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)" }}>
              Edu<span style={{ background: "linear-gradient(135deg, #7C3AED, #EC4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Vault</span>
            </span>
          </Link>
        ) : (
          <div style={{
            width: 34, height: 34,
            background: "linear-gradient(135deg, #7C3AED, #EC4899)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <GraduationCap size={18} color="white" />
          </div>
        )}
      </div>

      {/* User Card */}
      <div style={{
        padding: isHovered ? "1.25rem" : "1.25rem 0.5rem",
        borderBottom: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        alignItems: isHovered ? "stretch" : "center",
        width: "100%"
      }}>
        {!isHovered ? (
          <Link href="/dashboard/profile" style={{ position: "relative" }} title={`${user.name || "Student"} - Lv.${user.level || 1}`}>
            {user.image ? (
              <img src={user.image} alt={user.name || ""} className="avatar" style={{ width: 38, height: 38, margin: 0 }} />
            ) : (
              <div className="avatar-fallback" style={{ width: 38, height: 38, fontSize: "0.8rem", margin: 0 }}>{initials}</div>
            )}
            <span style={{
              position: "absolute", bottom: -2, right: -2,
              background: "#F59E0B", color: "white", borderRadius: "50%",
              width: 15, height: 15, fontSize: "0.55rem", fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1.5px solid var(--bg-surface)"
            }}>
              {user.level || 1}
            </span>
          </Link>
        ) : (
          <Link href="/dashboard/profile" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              {user.image ? (
                <img src={user.image} alt={user.name || ""} className="avatar" style={{ width: 40, height: 40 }} />
              ) : (
                <div className="avatar-fallback" style={{ width: 40, height: 40, fontSize: "0.875rem" }}>{initials}</div>
              )}
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-primary)" }}>
                  {user.name || "Student"}
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Lv.{user.level || 1} {getLevelName(user.level)}
                </div>
              </div>
            </div>

            {/* XP Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>⚡ {user.xp || 0} XP</span>
              <span style={{ fontSize: "0.72rem", color: "#F59E0B", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                <Flame size={11} /> {user.streak || 0}
              </span>
            </div>
            <div className="xp-bar">
              <div className="xp-fill" style={{ width: `${Math.min(((user.xp || 0) % 1000) / 10, 100)}%` }} />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: "0.75rem 0",
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        alignItems: isHovered ? "stretch" : "center",
        width: "100%"
      }}>
        {!isHovered ? null : (
          <div style={{ padding: "0 1.25rem 0.25rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-disabled)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Learning
          </div>
        )}
        {navItems.map(({ href, icon: Icon, label, color, bg }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              style={{
                justifyContent: isHovered ? "flex-start" : "center",
                padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
                margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
                width: isHovered ? "auto" : "48px",
                height: isHovered ? "auto" : "48px",
                borderRadius: isHovered ? "var(--radius-md)" : "14px",
                gap: isHovered ? "0.75rem" : "0"
              }}
              title={!isHovered ? label : undefined}
            >
              <NavIcon Icon={Icon} color={color} bg={bg} />
              {isHovered && <span style={{ fontWeight: 600 }}>{label}</span>}
            </Link>
          );
        })}

        {!isHovered ? null : (
          <div style={{ padding: "1rem 1.25rem 0.25rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-disabled)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.5rem" }}>
            Explore
          </div>
        )}
        {exploreItems.map(({ href, icon: Icon, label, color, bg }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              style={{
                justifyContent: isHovered ? "flex-start" : "center",
                padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
                margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
                width: isHovered ? "auto" : "48px",
                height: isHovered ? "auto" : "48px",
                borderRadius: isHovered ? "var(--radius-md)" : "14px",
                gap: isHovered ? "0.75rem" : "0"
              }}
              title={!isHovered ? label : undefined}
            >
              <NavIcon Icon={Icon} color={color} bg={bg} />
              {isHovered && <span style={{ fontWeight: 600 }}>{label}</span>}
            </Link>
          );
        })}

        {!isHovered ? null : (
          <div style={{ padding: "1rem 1.25rem 0.25rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-disabled)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.5rem" }}>
            Account
          </div>
        )}
        <Link
          href="/dashboard/profile"
          className={`sidebar-nav-item ${pathname === "/dashboard/profile" ? "active" : ""}`}
          style={{
            justifyContent: isHovered ? "flex-start" : "center",
            padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
            margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
            width: isHovered ? "auto" : "42px",
            height: isHovered ? "42px" : "42px",
            borderRadius: isHovered ? "var(--radius-md)" : "50%",
            gap: isHovered ? "0.75rem" : "0"
          }}
          title={!isHovered ? "Profile" : undefined}
        >
          <User size={18} strokeWidth={2.25} />
          {isHovered && <span>Profile</span>}
        </Link>

        {user.role === "INSTRUCTOR" && (
          <>
            {!isHovered ? null : (
              <div style={{ padding: "1rem 1.25rem 0.25rem", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-disabled)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                Instructor
              </div>
            )}
            <Link
              href="/instructor"
              className={`sidebar-nav-item ${pathname.startsWith("/instructor") ? "active" : ""}`}
              style={{
                justifyContent: isHovered ? "flex-start" : "center",
                padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
                margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
                width: isHovered ? "auto" : "42px",
                height: isHovered ? "42px" : "42px",
                borderRadius: isHovered ? "var(--radius-md)" : "50%",
                gap: isHovered ? "0.75rem" : "0"
              }}
              title={!isHovered ? "Instructor Hub" : undefined}
            >
              <Brain size={18} />
              {isHovered && <span>Instructor Hub</span>}
            </Link>
          </>
        )}
      </nav>

      {/* Bottom Actions */}
      <div style={{
        padding: "0.5rem 0 1rem",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        flexDirection: "column",
        alignItems: isHovered ? "stretch" : "center",
        width: "100%"
      }}>
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className="sidebar-nav-item"
          style={{
            justifyContent: isHovered ? "flex-start" : "center",
            padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
            margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
            width: isHovered ? "calc(100% - 1.5rem)" : "42px",
            height: isHovered ? "42px" : "42px",
            borderRadius: isHovered ? "var(--radius-md)" : "50%",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            gap: isHovered ? "0.75rem" : "0"
          }}
          title={!isHovered ? "Toggle Theme" : undefined}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          {isHovered && <span>Theme ({theme === "light" ? "Dark" : "Light"})</span>}
        </button>

        <Link
          href="/dashboard/settings"
          className={`sidebar-nav-item ${pathname === "/dashboard/settings" ? "active" : ""}`}
          style={{
            justifyContent: isHovered ? "flex-start" : "center",
            padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
            margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
            width: isHovered ? "auto" : "42px",
            height: isHovered ? "42px" : "42px",
            borderRadius: isHovered ? "var(--radius-md)" : "50%",
            gap: isHovered ? "0.75rem" : "0"
          }}
          title={!isHovered ? "Settings" : undefined}
        >
          <Settings size={18} />
          {isHovered && <span>Settings</span>}
        </Link>
        
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="sidebar-nav-item"
          style={{
            width: isHovered ? "calc(100% - 1.5rem)" : "42px",
            height: isHovered ? "42px" : "42px",
            justifyContent: isHovered ? "flex-start" : "center",
            padding: isHovered ? "0.7rem 1.25rem" : "0.7rem 0",
            margin: isHovered ? "0.15rem 0.75rem" : "0.15rem 0.5rem",
            borderRadius: isHovered ? "var(--radius-md)" : "50%",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#EF4444",
            display: "flex",
            alignItems: "center",
            gap: isHovered ? "0.75rem" : "0"
          }}
          title={!isHovered ? "Sign Out" : undefined}
        >
          <LogOut size={18} />
          {isHovered && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
