"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutDashboard, Trophy, Activity, ClipboardList, Settings, LogOut, ChevronRight, Bot, MapPin, Gift, Users } from "lucide-react";

interface SidebarProps {
  userName?: string;
  userRole?: string;
  userLevel?: { name: string; color: string; maxRating: number };
}

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, roles: ["athlete", "organizer", "admin"] },
  { href: "/campeonatos", label: "Ligas & Torneios", icon: <Trophy size={18} />, roles: ["athlete", "organizer", "admin"] },
  { href: "/ranking", label: "Ranking Oficial", icon: <Activity size={18} />, roles: ["athlete", "organizer", "admin"] },
  { href: "/matchmaking", label: "Encontrar Duplas", icon: <Users size={18} />, roles: ["athlete"] },
  { href: "/coach", label: "Coach IA", icon: <Bot size={18} />, roles: ["athlete", "organizer", "admin"] },
  { href: "/quadras", label: "Quadras Locais", icon: <MapPin size={18} />, roles: ["athlete", "organizer", "admin"] },
  { href: "/clube", label: "Clube Vantagens", icon: <Gift size={18} />, roles: ["athlete", "organizer", "admin"] },
  { href: "/organizar", label: "Gestão Organizador", icon: <ClipboardList size={18} />, roles: ["organizer", "admin"] },
  { href: "/admin", label: "Painel Admin", icon: <Settings size={18} />, roles: ["admin"] },
];

export default function Sidebar({ userName, userRole, userLevel }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const filteredItems = NAV_ITEMS.filter((item) =>
    userRole ? item.roles.includes(userRole) : false
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-64 flex flex-col h-screen border-r border-white/5 sticky top-0" style={{ background: "rgba(8,8,10,0.95)" }}>
      {/* Logo */}
      <div className="h-20 flex items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-black uppercase tracking-tight">
            <span className="gradient-text">Quadra</span>
            <span className="text-white">Hub</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="text-[10px] font-bold tracking-widest uppercase mb-4 px-2" style={{ color: "var(--color-text-muted)" }}>
          Menu Principal
        </div>
        <nav className="space-y-1.5">
          {filteredItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group"
                style={{
                  background: isActive ? "var(--color-primary-glow)" : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                  borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                }}
              >
                <span className={isActive ? "opacity-100" : "opacity-60 group-hover:opacity-100 transition-opacity"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card */}
      {userName && (
        <div className="p-4 border-t border-white/5">
          <Link href="/perfil" className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5 group relative overflow-hidden">
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 relative z-10"
              style={{
                background: "var(--color-bg)",
                color: "var(--color-primary)",
                border: "2px solid var(--color-border)",
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 relative z-10">
              <div className="text-sm font-bold truncate">{userName.split(" ")[0]}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: userLevel?.color || "#F59E0B" }} />
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: userLevel?.color || "#F59E0B" }}>
                  {userLevel?.name || "Atleta"}
                </span>
              </div>
            </div>

            <ChevronRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors relative z-10" />
            
            {/* Glow BG */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: `linear-gradient(90deg, ${userLevel?.color || "var(--color-primary)"}, transparent)` }} />
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors hover:bg-red-500/10 hover:text-red-500 text-white/40"
          >
            <LogOut size={14} /> Sair
          </button>
        </div>
      )}
    </aside>
  );
}
