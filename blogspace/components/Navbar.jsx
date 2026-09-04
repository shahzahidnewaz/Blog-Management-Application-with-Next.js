"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar({ onOpenSidebar }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get("title") || "");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("title", query);
    router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-16 bg-paper/95 backdrop-blur border-b border-ink-200">
      <div className="h-full max-w-6xl mx-auto px-4 flex items-center gap-4">
        {isAuthenticated && onOpenSidebar && (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="lg:hidden p-2 -ml-2 text-ink-600"
            aria-label="Open menu"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        )}

        <Link href="/" className="font-display text-xl text-ink-900 shrink-0">
          BlogSpace
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-0 sm:max-w-md">
          <input
  type="search"
  value={query}
  onChange={(e) => {
    const value = e.target.value;
    setQuery(value);
    if (value === "") {
      router.push("/");
    }
  }}
  placeholder="Search blogs..."
  aria-label="Search blogs"
  className="w-full rounded-full border border-ink-200 bg-white px-4 py-2 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-moss-400"
/>
        </form>

        <div className="ml-auto flex items-center gap-3">
          {isAuthenticated ? (
            <ProfileMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-700 hover:text-ink-900 px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-paper bg-moss-600 hover:bg-moss-700 rounded-md px-4 py-2"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
