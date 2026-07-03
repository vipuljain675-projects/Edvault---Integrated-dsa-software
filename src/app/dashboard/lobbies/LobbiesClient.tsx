"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, UserCheck, MessageSquare, ArrowRight, Shield } from "lucide-react";
import toast from "react-hot-toast";

interface LobbyMember {
  name: string;
  image: string | null;
  role: string;
}

interface Lobby {
  id: string;
  code: string;
  name: string;
  memberCount: number;
  members: LobbyMember[];
}

interface Props {
  initialLobbies: Lobby[];
}

export default function LobbiesClient({ initialLobbies }: Props) {
  const router = useRouter();
  const [lobbies, setLobbies] = useState<Lobby[]>(initialLobbies);
  const [joinCode, setJoinCode] = useState("");
  const [lobbyName, setLobbyName] = useState("");
  
  const [joining, setJoining] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      toast.error("Please enter a lobby code");
      return;
    }
    setJoining(true);
    try {
      const res = await fetch("/api/lobbies/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: joinCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to join lobby");
      
      toast.success(`Joined room: ${data.name}! 🎉`);
      router.push(`/dashboard/lobbies/${data.code}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to join room");
    } finally {
      setJoining(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lobbyName.trim()) {
      toast.error("Please enter a lobby name");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/lobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: lobbyName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create lobby");
      
      toast.success(`Lobby "${data.name}" created! 🚀`);
      router.push(`/dashboard/lobbies/${data.code}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Title */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          👥 Lobbies
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Join coding rooms to solve sheets with doston, check dynamic leaderboards, and keep tabs on progress.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1.5rem", alignItems: "start" }}>
        
        {/* Left Column: Joined Lobbies */}
        <div className="card" style={{ padding: "1.75rem", minHeight: "350px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            Active Joined Lobbies
          </h3>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Jump back into your rooms to solve custom coding quests together.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {lobbies.map((lobby) => (
              <div
                key={lobby.id}
                onClick={() => router.push(`/dashboard/lobbies/${lobby.code}`)}
                className="lobby-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)" }}>{lobby.name}</div>
                  <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    <span>Code: <strong>{lobby.code}</strong></span>
                    <span>•</span>
                    <span>{lobby.memberCount} members</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ display: "flex", marginRight: "0.5rem" }}>
                    {lobby.members.slice(0, 3).map((m, idx) => (
                      <div
                        key={idx}
                        style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: "var(--accent-violet)", color: "white",
                          fontSize: "0.6rem", fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          marginLeft: idx > 0 ? "-8px" : "0",
                          border: "2px solid var(--bg-surface)",
                          overflow: "hidden"
                        }}
                        title={m.name}
                      >
                        {m.image ? <img src={m.image} alt={m.name} /> : m.name[0]}
                      </div>
                    ))}
                  </div>
                  <ArrowRight size={16} color="var(--text-disabled)" />
                </div>
              </div>
            ))}

            {lobbies.length === 0 && (
              <div style={{ border: "2px dashed var(--border-subtle)", borderRadius: "12px", padding: "3.5rem 1.5rem", textAlign: "center", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                <Users size={32} color="var(--text-disabled)" />
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>You haven&apos;t joined any lobbies.</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-disabled)", maxWidth: "280px" }}>
                  Create a new lobby below or ask your friends for their lobby code to join them!
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Join Lobby via Code */}
          <form onSubmit={handleJoin} className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Join Lobby via Code
            </h3>
            <p style={{ fontSize: "0.72rem", color: "var(--text-disabled)", marginBottom: "1rem" }}>
              Enter room code shared by friends.
            </p>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                className="input"
                placeholder="LOBBYCODE"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                style={{ flex: 1, textTransform: "uppercase", padding: "0.5rem 0.75rem", borderRadius: "6px" }}
                disabled={joining}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ background: "var(--accent-violet)", padding: "0 1.25rem" }}
                disabled={joining}
              >
                {joining ? "Joining..." : "Join Lobby"}
              </button>
            </div>
          </form>

          {/* Create New Lobby */}
          <form onSubmit={handleCreate} className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Create New Lobby
            </h3>
            <p style={{ fontSize: "0.72rem", color: "var(--text-disabled)", marginBottom: "1rem" }}>
              Start a new group to study sheets.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <input
                type="text"
                className="input"
                placeholder="Lobby name (e.g. DP Grinders)"
                value={lobbyName}
                onChange={(e) => setLobbyName(e.target.value)}
                style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px" }}
                disabled={creating}
              />
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                style={{ width: "100%", background: "var(--accent-violet)", padding: "0.5rem 0" }}
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Lobby"}
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
