"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { GraduationCap, ArrowRight, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Active link helper
  const isActive = (path: string) => {
    return pathname === path ? "var(--text-primary)" : "var(--text-muted)";
  };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      padding: "0 1.5rem", height: "68px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      background: "rgba(15,10,30,0.9)", backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(124,58,237,0.15)",
    }}>
      {/* Brand Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #7C3AED, #EC4899)",
          borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <GraduationCap size={20} color="white" />
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-primary)" }}>
          Edu<span className="gradient-text">Vault</span>
        </span>
      </Link>

      {/* Navigation items */}
      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {[
          { label: "Courses", href: "/courses" },
          { label: "Roadmaps", href: "/roadmaps" },
          { label: "Community", href: "/community" },
          { label: "Blog", href: "/blog" },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              color: isActive(item.href),
              textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (pathname !== item.href) e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              if (pathname !== item.href) e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Authentication CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {session ? (
          <Link
            href="/dashboard"
            className="btn btn-primary btn-sm"
            style={{ gap: "0.4rem" }}
          >
            <LayoutDashboard size={14} /> Dashboard <ArrowRight size={14} />
          </Link>
        ) : (
          <>
            <Link href="/auth/login" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link href="/auth/signup" className="btn btn-primary btn-sm" style={{ gap: "0.2rem" }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
