"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ArrowLeft, Trophy, Target, GraduationCap, CheckCircle2, RefreshCw, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const steps = [
  { id: 1, title: "Welcome Aboard" },
  { id: 2, title: "DSA Experience" },
  { id: 3, title: "Connect LeetCode" },
  { id: 4, title: "Target Company" },
  { id: 5, title: "Timeline" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  
  // State variables for form
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [gradYear, setGradYear] = useState("2028");
  const [dsaLevel, setDsaLevel] = useState(""); // BEGINNER | INTERMEDIATE | ADVANCED
  const [targetCompany, setTargetCompany] = useState(""); // FAANG | STARTUPS | SERVICE
  const [targetTimeline, setTargetTimeline] = useState(""); // 1_MONTH | 3_MONTHS | 6_MONTHS
  
  // LeetCode verification
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedStats, setVerifiedStats] = useState<any>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set name when session is available
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Auth checks and redirects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (status === "authenticated" && session?.user && (session.user as any).onboarded) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const handleVerifyLeetcode = async () => {
    if (!leetcodeUsername.trim()) {
      toast.error("Please enter a username or profile URL");
      return;
    }
    setIsVerifying(true);
    setVerifiedStats(null);
    try {
      const res = await fetch("/api/leetcode/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: leetcodeUsername }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to verify LeetCode account");
      }
      setVerifiedStats(data.stats);
      setLeetcodeUsername(data.username); // Use the cleaned username returned
      toast.success("LeetCode profile connected! 🟢");
    } catch (err: any) {
      toast.error(err.message || "Could not find profile. Make sure it is public.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }
      if (!college.trim()) {
        toast.error("Please enter your college or university name");
        return;
      }
      if (!gradYear.trim()) {
        toast.error("Please enter your graduation year");
        return;
      }
    }
    if (currentStep === 2 && !dsaLevel) {
      toast.error("Please select your experience level");
      return;
    }
    if (currentStep === 3) {
      // Connect LeetCode is optional. If they entered text but didn't verify it:
      if (leetcodeUsername.trim() && !verifiedStats) {
        toast.error("Please verify your LeetCode username or clear the field to continue");
        return;
      }
    }
    if (currentStep === 4 && !targetCompany) {
      toast.error("Please select a target company tier");
      return;
    }
    if (currentStep === 5 && !targetTimeline) {
      toast.error("Please select a practice timeline");
      return;
    }

    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          college,
          gradYear,
          dsaLevel,
          targetCompany,
          targetTimeline,
          leetcodeUsername: verifiedStats ? leetcodeUsername : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save onboarding details");
      }

      toast.success("Profile initialized! Welcome to EduVault.");
      
      // Update local auth session state
      await updateSession({ onboarded: true });

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.message?.includes("Record to update not found") || err.message?.includes("not found")
          ? "Your session expired after database reset. Please Sign Out and Sign In again to register properly."
          : err.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-light" style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-base)",
      padding: "2rem",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background Radial Glow */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Main Container */}
      <div className="card" style={{
        width: "100%",
        maxWidth: "540px",
        borderRadius: "16px",
        padding: "2.5rem",
        boxShadow: "var(--shadow-lg)",
        position: "relative",
        zIndex: 1,
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)"
      }}>
        
        {/* Step Indicator Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: 28, height: 28,
              background: "#6366F1",
              borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <GraduationCap size={15} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>
              EduVault
            </span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {steps.map(s => (
              <div key={s.id} style={{
                width: 20,
                height: 6,
                borderRadius: "var(--radius-full)",
                background: s.id === currentStep 
                  ? "#6366F1" 
                  : s.id < currentStep 
                    ? "rgba(99,102,241,0.4)" 
                    : "var(--bg-overlay)",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>

        {/* Wizard Form Screens */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ minHeight: "220px" }}
          >
            {/* Step 1: Welcome Aboard */}
            {currentStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.25rem", color: "var(--text-primary)" }}>Welcome aboard! 👋</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1rem" }}>
                    Let&apos;s start with a few basics to personalise your journey.
                  </p>
                </div>
                
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                    style={{
                      width: "100%", padding: "0.75rem 1rem", borderRadius: "8px",
                      background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                      color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
                    }}
                    autoFocus
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                    College / University
                  </label>
                  <input
                    type="text"
                    placeholder="Search or type your college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="input"
                    style={{
                      width: "100%", padding: "0.75rem 1rem", borderRadius: "8px",
                      background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                      color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    placeholder="2028"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="input"
                    style={{
                      width: "100%", padding: "0.75rem 1rem", borderRadius: "8px",
                      background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                      color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Experience Level */}
            {currentStep === 2 && (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.8rem", background: "rgba(99,102,241,0.08)", borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
                  <Trophy size={13} color="#6366F1" />
                  <span style={{ fontSize: "0.75rem", color: "#6366F1", fontWeight: 600 }}>Experience Level</span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>Where are you starting from?</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                  We will curate roadmap concepts and problem complexity accordingly.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {[
                    { key: "BEGINNER", title: "Beginner", desc: "Just starting coding, don&apos;t know Big-O notation" },
                    { key: "INTERMEDIATE", title: "Intermediate", desc: "Know array/string, solved some simple LeetCode Qs" },
                    { key: "ADVANCED", title: "Advanced", desc: "Understand Trees & Graphs, looking to master DP" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setDsaLevel(opt.key)}
                      style={{
                        textAlign: "left", width: "100%", padding: "0.85rem 1rem", borderRadius: "8px",
                        background: dsaLevel === opt.key ? "rgba(99,102,241,0.06)" : "var(--bg-elevated)",
                        border: dsaLevel === opt.key ? "1px solid #6366F1" : "1px solid var(--border-default)",
                        color: "var(--text-primary)", cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.1rem" }}>{opt.title}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Connect LeetCode */}
            {currentStep === 3 && (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.8rem", background: "rgba(99,102,241,0.08)", borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
                  <CheckCircle2 size={13} color="#6366F1" />
                  <span style={{ fontSize: "0.75rem", color: "#6366F1", fontWeight: 600 }}>Connect LeetCode</span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>Connect LeetCode 🔗</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                  Required - we sync your coding stats to calibrate your level. Fill either your username or your profile URL.
                </p>

                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    placeholder="LeetCode Username or URL"
                    value={leetcodeUsername}
                    onChange={(e) => setLeetcodeUsername(e.target.value)}
                    className="input"
                    style={{
                      flex: 1, padding: "0.75rem 1rem", borderRadius: "8px",
                      background: "var(--bg-elevated)", border: "1px solid var(--border-default)",
                      color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
                    }}
                    disabled={isVerifying}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyLeetcode()}
                  />
                  <button
                    onClick={handleVerifyLeetcode}
                    disabled={isVerifying}
                    className="btn btn-secondary"
                    style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0 1.2rem", height: "46px" }}
                  >
                    {isVerifying ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      "Connect"
                    )}
                  </button>
                </div>

                {verifiedStats && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      padding: "0.85rem 1rem",
                      background: "rgba(22,163,74,0.06)",
                      border: "1px solid rgba(22,163,74,0.2)",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "0.84rem", color: "#16A34A", marginBottom: "0.4rem" }}>
                      ✓ Connected as @{verifiedStats.username}
                    </div>
                    <div style={{ display: "flex", gap: "1rem", fontSize: "0.76rem", color: "var(--text-muted)" }}>
                      <span>Total: <strong style={{ color: "var(--text-primary)" }}>{verifiedStats.total}</strong></span>
                      <span style={{ color: "#16A34A" }}>Easy: <strong>{verifiedStats.easy}</strong></span>
                      <span style={{ color: "#D97706" }}>Medium: <strong>{verifiedStats.medium}</strong></span>
                      <span style={{ color: "#DC2626" }}>Hard: <strong>{verifiedStats.hard}</strong></span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Step 4: Target Company Tier */}
            {currentStep === 4 && (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.8rem", background: "rgba(16,185,129,0.08)", borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
                  <Target size={13} color="#10B981" />
                  <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 600 }}>Target Company</span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>What is your target?</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                  This shapes your overall Placement Readiness benchmarks.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {[
                    { key: "FAANG", title: "FAANG & Top Product Companies", desc: "Google, Microsoft, Amazon, Uber (requires high DSA depth)" },
                    { key: "STARTUPS", title: "High-Growth Startups", desc: "Razorpay, Swiggy, Zomato (needs strong dev + solid DSA)" },
                    { key: "SERVICE", title: "Service-Based / Mass Recruiters", desc: "TCS, Infosys, Wipro (requires basic syntax & array questions)" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setTargetCompany(opt.key)}
                      style={{
                        textAlign: "left", width: "100%", padding: "0.85rem 1rem", borderRadius: "8px",
                        background: targetCompany === opt.key ? "rgba(16,185,129,0.06)" : "var(--bg-elevated)",
                        border: targetCompany === opt.key ? "1px solid #10B981" : "1px solid var(--border-default)",
                        color: "var(--text-primary)", cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.1rem" }}>{opt.title}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Timeline */}
            {currentStep === 5 && (
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.8rem", background: "rgba(245,158,11,0.08)", borderRadius: "var(--radius-full)", marginBottom: "1rem" }}>
                  <Sparkles size={13} color="#F59E0B" />
                  <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 600 }}>Timeline</span>
                </div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary)" }}>Your timeline for practice?</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                  We will design daily target quotas based on this duration.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  {[
                    { key: "1_MONTH", title: "1 Month (Crash Prep)", desc: "Intense daily practice for upcoming interview" },
                    { key: "3_MONTHS", title: "3 Months (Standard Prep)", desc: "Balanced daily load of 2-3 questions" },
                    { key: "6_MONTHS", title: "6 Months+ (Mastery Prep)", desc: "Deep dive from scratch to SDE master" }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setTargetTimeline(opt.key)}
                      style={{
                        textAlign: "left", width: "100%", padding: "0.85rem 1rem", borderRadius: "8px",
                        background: targetTimeline === opt.key ? "rgba(245,158,11,0.06)" : "var(--bg-elevated)",
                        border: targetTimeline === opt.key ? "1px solid #F59E0B" : "1px solid var(--border-default)",
                        color: "var(--text-primary)", cursor: "pointer", transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.1rem" }}>{opt.title}</div>
                      <div style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", borderTop: "1px solid var(--border-subtle)", paddingTop: "1.5rem" }}>
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              disabled={isSubmitting}
              className="btn btn-secondary"
              style={{ padding: "0.8rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              disabled={isSubmitting}
              className="btn btn-secondary"
              style={{ padding: "0.8rem 1.2rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "#EF4444" }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={isSubmitting || (currentStep === 3 && isVerifying)}
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: "0.8rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              background: "#6366F1",
              color: "white"
            }}
          >
            {isSubmitting ? (
              "Initializing..."
            ) : currentStep === 5 ? (
              <>Complete Setup <Trophy size={16} /></>
            ) : (
              <>Continue <ArrowRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
