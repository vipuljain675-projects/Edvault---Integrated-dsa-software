import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent: "violet" | "amber" | "rose" | "emerald" | "cyan" | "indigo";
}

const accents = {
  violet: { color: "#A855F7", bg: "rgba(124,58,237,0.14)", border: "rgba(124,58,237,0.28)" },
  amber:  { color: "#F59E0B", bg: "rgba(245,158,11,0.14)", border: "rgba(245,158,11,0.28)" },
  rose:   { color: "#F43F5E", bg: "rgba(244,63,94,0.14)",  border: "rgba(244,63,94,0.28)" },
  emerald:{ color: "#10B981", bg: "rgba(16,185,129,0.14)",  border: "rgba(16,185,129,0.28)" },
  cyan:   { color: "#06B6D4", bg: "rgba(6,182,212,0.14)",   border: "rgba(6,182,212,0.28)" },
  indigo: { color: "#6366F1", bg: "rgba(99,102,241,0.14)", border: "rgba(99,102,241,0.28)" },
};

export default function StatCard({ label, value, sub, icon, accent }: StatCardProps) {
  const a = accents[accent];
  return (
    <div className="metric-card">
      <div className="metric-card-glow" style={{ background: a.color }} />
      <div className="metric-card-inner">
        <div className="icon-orb" style={{ background: a.bg, borderColor: a.border, color: a.color }}>
          {icon}
        </div>
        <div className="metric-card-body">
          <span className="metric-label">{label}</span>
          <div className="metric-value" style={{ color: a.color }}>{value}</div>
          {sub && <span className="metric-sub">{sub}</span>}
        </div>
      </div>
    </div>
  );
}
