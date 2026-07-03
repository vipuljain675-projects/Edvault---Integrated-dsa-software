export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { recalculateUserStreak } from "@/lib/streak";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  if (!(session.user as any).onboarded) redirect("/onboarding");

  // Keep streak honest when the user only opens the app without solving today.
  await recalculateUserStreak(session.user.id);

  // Query fresh user details from DB to bypass stale JWT session caching
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!dbUser) redirect("/auth/login");

  return (
    <div id="dashboard-root" className="dashboard-dark" style={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar user={dbUser as any} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <DashboardTopbar user={dbUser as any} />
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}
