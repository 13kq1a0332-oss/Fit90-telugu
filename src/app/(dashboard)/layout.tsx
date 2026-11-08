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
    <div className="min-h-screen flex flex-col bg-ambient-mesh pb-20 md:pb-8 dark:bg-slate-950 overflow-x-hidden relative">
      {/* Ambient background blur orbs for depth */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none fixed top-1/3 -right-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 left-1/3 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      <SafetyBanner compact />
      <Navbar userEmail={user?.email || "user@example.com"} />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6 overflow-x-hidden relative z-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

