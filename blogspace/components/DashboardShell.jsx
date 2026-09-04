"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Loader from "./Loader";
import { useAuth } from "@/context/AuthContext";

export default function DashboardShell({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (requireAdmin && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [initializing, isAuthenticated, isAdmin, requireAdmin, router]);

  if (initializing || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="h-16 border-b border-ink-200" />
        <Loader label="Checking access..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Suspense fallback={<div className="h-16" />}>
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      </Suspense>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="pt-16 lg:pl-64">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
