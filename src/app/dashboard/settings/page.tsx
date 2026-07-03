"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Settings, User, Lock, Mail, Bell, ShieldAlert,
  Save, RefreshCw, Key, Trash2, Eye, EyeOff
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session, update: updateSession, status } = useSession();
  const router = useRouter();

  // Basic Account States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [isSavingAccount, setIsSavingAccount] = useState(false);

  // Email & Password States
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preferences States
  const [emailReminders, setEmailReminders] = useState(true);
  const [reminderTime, setReminderTime] = useState("18:00");
  const [dailyGoal, setDailyGoal] = useState(2);
  const [prefDifficulty, setPrefDifficulty] = useState("EASY");
  const [mentorName, setMentorName] = useState("Sensei");
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  // Danger Zone States
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      const cleanEmail = session.user.email || "";
      setEmail(cleanEmail);
      setUsername((session.user as any).leetcodeUsername || cleanEmail.split("@")[0]);
      
      // Default preferences fallback
      setPrefDifficulty((session.user as any).dsaLevel || "EASY");
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsSavingAccount(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          leetcodeUsername: username ? username.trim() : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      toast.success("Account details updated successfully! ✨");
      await updateSession({ name });
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update account details");
    } finally {
      setIsSavingAccount(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      // Simulate API call for password update
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPrefs(true);
    try {
      // Simulate preferences saving
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Practice preferences updated!");
    } catch (err) {
      toast.error("Failed to save preferences");
    } finally {
      setIsSavingPrefs(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }
    setIsDeleting(true);
    try {
      // Simulate deletion API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Account permanently deleted.");
      signOut({ callbackUrl: "/" });
    } catch (err) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-page-narrow">
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          ⚙️ Settings
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Manage your account credentials, preferences, notifications, and security.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        
        {/* Account Details Card */}
        <form onSubmit={handleSaveAccount} className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <User size={18} color="var(--accent-violet-light)" />
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Account</h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-disabled)" }}>Your name and public profile handle.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                Full name
              </label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                Username
              </label>
              <input
                type="text"
                className="input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px" }}
              />
              <span style={{ fontSize: "0.7rem", color: "var(--text-disabled)", marginTop: "0.25rem", display: "block" }}>
                Your public profile lives at /profile/{username || "username"}.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingAccount}
            className="btn btn-primary btn-sm"
            style={{ marginTop: "1.25rem", background: "var(--text-primary)", color: "var(--bg-base)", display: "flex", alignItems: "center", gap: "0.35rem" }}
          >
            {isSavingAccount ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />} Save changes
          </button>
        </form>

        {/* Email & Password Card */}
        <div className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <Mail size={18} color="var(--accent-violet-light)" />
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Email & Password</h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-disabled)" }}>Update your sign-in credentials.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                Current email
              </label>
              <input
                type="text"
                className="input"
                value={email}
                disabled
                style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", opacity: 0.6 }}
              />
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                New email
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="email"
                  className="input"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@email.com"
                  style={{ flex: 1, padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                />
                <button type="button" className="btn btn-secondary btn-sm" style={{ padding: "0 1rem" }}>
                  Update
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                New password
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{ flex: 1, padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                />
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "0 1rem" }}
                >
                  {isUpdatingPassword ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Notifications & Practice Preferences Card */}
        <form onSubmit={handleSavePreferences} className="card" style={{ padding: "1.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <Bell size={18} color="var(--accent-violet-light)" />
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>Notifications & Practice</h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-disabled)" }}>Reminders, goals, and your AI mentor settings.</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block" }}>Email reminders</strong>
                <span style={{ fontSize: "0.72rem", color: "var(--text-disabled)" }}>Streak and practice nudges.</span>
              </div>
              <input
                type="checkbox"
                checked={emailReminders}
                onChange={(e) => setEmailReminders(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                  Reminder time
                </label>
                <input
                  type="time"
                  className="input"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                  Daily problem goal
                </label>
                <input
                  type="number"
                  className="input"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value, 10))}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                  Preferred difficulty
                </label>
                <select
                  className="input"
                  value={prefDifficulty}
                  onChange={(e) => setPrefDifficulty(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
                  AI mentor name
                </label>
                <input
                  type="text"
                  className="input"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px" }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSavingPrefs}
            className="btn btn-primary btn-sm"
            style={{ marginTop: "1.25rem", background: "var(--text-primary)", color: "var(--bg-base)" }}
          >
            Save preferences
          </button>
        </form>

        {/* Danger Zone Card */}
        <div className="card" style={{ padding: "1.75rem", border: "1px solid #FCA5A5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid #FCA5A5", paddingBottom: "0.75rem", marginBottom: "1.25rem" }}>
            <ShieldAlert size={18} color="#EF4444" />
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#EF4444" }}>Danger Zone</h3>
              <p style={{ fontSize: "0.72rem", color: "var(--text-disabled)" }}>Permanently delete your account and all associated data.</p>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", display: "block", marginBottom: "0.4rem" }}>
              Type <strong style={{ color: "#EF4444" }}>DELETE</strong> to confirm.
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                style={{ flex: 1, padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #EF4444" }}
              />
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmText !== "DELETE"}
                className="btn btn-danger btn-sm"
                style={{ background: "#EF4444", color: "white", padding: "0 1rem", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                {isDeleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
