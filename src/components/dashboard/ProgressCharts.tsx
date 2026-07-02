"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";

interface LogItem {
  date: string;
  minutesStudied: number;
  xpEarned: number;
}

interface Props {
  data: LogItem[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-elevated)",
      border: "1px solid var(--border-default)",
      borderRadius: "12px",
      padding: "0.65rem 0.85rem",
      boxShadow: "var(--shadow-md)",
      fontSize: "0.8rem",
    }}>
      <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.25rem" }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontWeight: 600 }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function ProgressCharts({ data }: Props) {
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

  const chartData = sortedData.map((item) => {
    const [, month, day] = item.date.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = month && day ? `${months[parseInt(month) - 1]} ${day}` : item.date;
    return { ...item, formattedDate };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div className="chart-card">
        <div className="chart-card-header">
          <h4 className="chart-card-title">
            <span className="icon-orb icon-orb-sm" style={{ background: "rgba(124,58,237,0.14)", borderColor: "rgba(124,58,237,0.28)", color: "#A855F7" }}>
              <BarChart3 size={16} strokeWidth={2.5} />
            </span>
            Study Minutes (Last 14 Days)
          </h4>
        </div>
        <div style={{ width: "100%", height: 280 }}>
          {chartData.length === 0 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-disabled)" }}>
              No study data recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-subtle)" vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="formattedDate" stroke="var(--text-disabled)" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-disabled)" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124,58,237,0.06)", radius: 8 }} />
                <Bar dataKey="minutesStudied" fill="url(#barViolet)" radius={[8, 8, 0, 0]} name="Minutes Studied" maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-card-header">
          <h4 className="chart-card-title">
            <span className="icon-orb icon-orb-sm" style={{ background: "rgba(245,158,11,0.14)", borderColor: "rgba(245,158,11,0.28)", color: "#F59E0B" }}>
              <TrendingUp size={16} strokeWidth={2.5} />
            </span>
            XP Points Earned
          </h4>
        </div>
        <div style={{ width: "100%", height: 280 }}>
          {chartData.length === 0 ? (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-disabled)" }}>
              No XP data recorded yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border-subtle)" vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="formattedDate" stroke="var(--text-disabled)" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-disabled)" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="xpEarned" stroke="#F59E0B" fillOpacity={1} fill="url(#colorXp)" strokeWidth={3} name="XP Earned" dot={{ r: 4, fill: "#F59E0B", strokeWidth: 2, stroke: "var(--bg-surface)" }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
