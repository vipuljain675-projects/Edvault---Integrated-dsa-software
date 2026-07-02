"use client";

import { useState, useEffect } from "react";
import { BookOpen, Clock, Calendar, ArrowRight, X, PenTool, User, Tag, ChevronRight, Search } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import { createBlogPost } from "./actions";

interface Article {
  id: string;
  title: string;
  desc: string;
  body: string;
  createdAt: Date;
  readTime: string;
  category: string;
  color: string;
  featured: boolean;
  authorName: string;
}

interface Props {
  initialArticles: Article[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "Careers": "💼",
  "DSA": "⚡",
  "Interview": "🎯",
  "Systems": "🏗️",
};

function formatDate(dateInput: any) {
  const d = new Date(dateInput);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function BlogClient({ initialArticles }: Props) {
  const [articlesList, setArticlesList] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    body: "",
    category: "Careers",
    readTime: "5 min read",
  });

  useEffect(() => {
    setArticlesList(initialArticles);
  }, [initialArticles]);

  const categories = ["All", ...Array.from(new Set(articlesList.map(a => a.category)))];
  const featuredArticle = articlesList.find(a => a.featured) || articlesList[0];
  const otherArticles = articlesList.filter(a => a.id !== featuredArticle?.id);

  const filteredOthers = otherArticles.filter(a => {
    const matchCat = activeCategory === "All" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleWriteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.desc || !formData.body) {
      return toast.error("Please fill in all fields");
    }
    setLoading(true);
    try {
      const res = await createBlogPost(formData);
      if (res.success) {
        setIsWriteModalOpen(false);
        setFormData({ title: "", desc: "", body: "", category: "Careers", readTime: "5 min read" });
        toast.success("Article published! ✍️");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        paddingTop: "100px",
        paddingBottom: "3rem",
        background: "linear-gradient(180deg, rgba(236,72,153,0.07) 0%, transparent 100%)",
        borderBottom: "1px solid var(--border-subtle)",
      }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="badge badge-pink" style={{ marginBottom: "1rem" }}>
            <BookOpen size={12} /> The EduVault Blog
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "1rem", lineHeight: 1.15 }}>
            Deep Dives &{" "}
            <span className="gradient-text-warm">Interview Insights</span>
          </h1>
          <p style={{ color: "var(--text-muted)", maxWidth: "560px", margin: "0 auto 2rem", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Practical articles written by engineers cracking FAANG, covering DSA patterns, career advice, and system design.
          </p>
          <button onClick={() => setIsWriteModalOpen(true)} className="btn btn-primary" style={{ gap: "0.5rem", padding: "0.75rem 1.75rem" }}>
            <PenTool size={16} /> Write an Article
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>

        {/* Featured Article */}
        {featuredArticle && (
          <div
            onClick={() => setSelectedArticle(featuredArticle)}
            style={{
              marginBottom: "3rem",
              padding: "2.5rem",
              background: "linear-gradient(135deg, rgba(26,18,48,0.95), rgba(124,58,237,0.12))",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "var(--radius-xl)",
              cursor: "pointer",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "2rem",
              alignItems: "center",
              transition: "border-color 0.2s, transform 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.6)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            <div>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "rgba(245,158,11,0.15)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.3)" }}>
                  ★ FEATURED
                </span>
                <span className="badge badge-violet">{featuredArticle.category}</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", marginBottom: "1rem", lineHeight: 1.3 }}>
                {featuredArticle.title}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "1.5rem", lineHeight: 1.7, maxWidth: "650px" }}>
                {featuredArticle.desc}
              </p>
              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.82rem", color: "var(--text-muted)", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <User size={13} /> {featuredArticle.authorName}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Calendar size={13} /> {formatDate(featuredArticle.createdAt)}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Clock size={13} /> {featuredArticle.readTime}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <button className="btn btn-primary btn-sm" style={{ gap: "0.4rem", whiteSpace: "nowrap" }}>
                Read Article <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Filters Row */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "var(--radius-full)",
                  border: `1px solid ${activeCategory === cat ? "#EC4899" : "var(--border-subtle)"}`,
                  background: activeCategory === cat ? "rgba(236,72,153,0.12)" : "var(--bg-elevated)",
                  color: activeCategory === cat ? "#EC4899" : "var(--text-muted)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {CATEGORY_ICONS[cat] || "📌"} {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-disabled)" }} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: "2.2rem", fontSize: "0.82rem", height: "36px", width: "220px", background: "var(--bg-elevated)" }}
            />
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filteredOthers.map((a) => (
            <div
              key={a.id}
              className="card"
              style={{ display: "flex", flexDirection: "column", padding: "0", cursor: "pointer", overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
              onClick={() => setSelectedArticle(a)}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 30px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLElement).style.boxShadow = "";
              }}
            >
              {/* Color Bar */}
              <div style={{ height: "4px", background: a.color || "var(--gradient-brand)" }} />

              <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <span style={{
                    padding: "0.2rem 0.6rem", fontSize: "0.68rem", fontWeight: 700,
                    borderRadius: "var(--radius-full)", background: `${a.color}15`,
                    color: a.color, border: `1px solid ${a.color}25`,
                  }}>
                    {CATEGORY_ICONS[a.category] || "📌"} {a.category}
                  </span>
                </div>

                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.65rem", lineHeight: 1.4 }}>{a.title}</h3>
                <p style={{
                  fontSize: "0.83rem", color: "var(--text-muted)", marginBottom: "1.25rem",
                  lineHeight: 1.6, flex: 1,
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden"
                }}>
                  {a.desc}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-subtle)", fontSize: "0.72rem", color: "var(--text-disabled)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <User size={11} /> {a.authorName}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <Clock size={11} /> {a.readTime}
                  </span>
                  <span>{formatDate(a.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOthers.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-disabled)" }}>
            No articles found for "{searchQuery}" in {activeCategory}.
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="modal-overlay" onClick={() => setSelectedArticle(null)} style={{ padding: "2rem", zIndex: 100, alignItems: "flex-start", paddingTop: "3rem" }}>
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: "720px", width: "100%", background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: "var(--radius-xl)", maxHeight: "86vh", overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            {/* Article Header */}
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border-subtle)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                <span className="badge" style={{ background: `${selectedArticle.color}15`, color: selectedArticle.color, border: `1px solid ${selectedArticle.color}25` }}>
                  {CATEGORY_ICONS[selectedArticle.category] || "📌"} {selectedArticle.category}
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <Clock size={12} /> {selectedArticle.readTime}
                </span>
              </div>
              <button onClick={() => setSelectedArticle(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", flexShrink: 0 }}>
                <X size={20} />
              </button>
            </div>

            {/* Article Body */}
            <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
              <h2 style={{ fontSize: "1.75rem", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                {selectedArticle.title}
              </h2>

              <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.75rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-subtle)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <User size={13} /> {selectedArticle.authorName}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Calendar size={13} /> {formatDate(selectedArticle.createdAt)}
                </span>
              </div>

              {/* Article content rendered as paragraphs */}
              <div style={{ fontSize: "0.97rem", lineHeight: 1.85, color: "var(--text-secondary)" }}>
                {(selectedArticle.body || selectedArticle.desc)
                  .split("\n\n")
                  .map((paragraph, i) => (
                    <p key={i} style={{ marginBottom: "1.25rem" }}>
                      {paragraph}
                    </p>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Write Article Modal */}
      {isWriteModalOpen && (
        <div className="modal-overlay" onClick={() => setIsWriteModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: "640px", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <PenTool size={18} color="#EC4899" /> Write an Article
              </h3>
              <button onClick={() => setIsWriteModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWriteSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Title</label>
                <input
                  type="text"
                  placeholder="e.g., How I cracked Amazon SDE-2 in 3 months"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  required disabled={loading}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                    style={{ background: "var(--bg-elevated)", color: "var(--text-primary)" }}
                    disabled={loading}
                  >
                    <option value="Careers">💼 Careers</option>
                    <option value="DSA">⚡ DSA</option>
                    <option value="Interview">🎯 Interview</option>
                    <option value="Systems">🏗️ Systems</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Est. Read Time</label>
                  <input
                    type="text"
                    placeholder="5 min read"
                    value={formData.readTime}
                    onChange={e => setFormData({ ...formData, readTime: e.target.value })}
                    className="input"
                    required disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Brief Summary (for card preview)</label>
                <input
                  type="text"
                  placeholder="A one-line summary shown on the article card..."
                  value={formData.desc}
                  onChange={e => setFormData({ ...formData, desc: e.target.value })}
                  className="input"
                  required disabled={loading}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Article Body</label>
                <textarea
                  placeholder="Write your full article here. Use double line breaks to separate paragraphs..."
                  value={formData.body}
                  onChange={e => setFormData({ ...formData, body: e.target.value })}
                  className="input"
                  style={{ minHeight: "180px", resize: "vertical", fontFamily: "var(--font-body)", lineHeight: 1.6 }}
                  required disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
                {loading ? "Publishing..." : "✍️ Publish Article"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
