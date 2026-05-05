import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import { getLevelForRating } from "@/lib/elo";
import { capitalizeName } from "@/lib/utils";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile
  const { data: userData } = await supabase
    .from("users")
    .select("name, role")
    .eq("id", user.id)
    .single();

  const { data: profile } = await supabase
    .from("athlete_profiles")
    .select("rating")
    .eq("user_id", user.id)
    .single();

  const userName = capitalizeName(userData?.name || user.email || "Usuário");
  const userRole = userData?.role || "athlete";
  const rating = profile?.rating ?? 1000;
  const userLevel = getLevelForRating(rating);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar userName={userName} userRole={userRole} userLevel={userLevel} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
