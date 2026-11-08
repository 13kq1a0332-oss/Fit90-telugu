import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SafetyBanner } from "@/components/layout/safety-banner";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 pb-20 md:pb-8 dark:bg-slate-950 overflow-x-hidden">
      <SafetyBanner compact />
      <Navbar userEmail={user?.email || "user@example.com"} />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:px-6 overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

