"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (!user) return null;

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/login");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full pr-2 pl-1 py-1 hover:bg-ink-100"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar user={user} size={32} />
        <span className="text-sm font-medium text-ink-800 hidden sm:inline">
          {user.firstname} {user.lastname}
        </span>
        <ChevronDown size={16} className="text-ink-400" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-md border border-ink-200 bg-white shadow-lg py-1 z-40"
        >
          <Link
            href="/dashboard/profile"
            role="menuitem"
            className="block px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/dashboard/change-password"
            role="menuitem"
            className="block px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
            onClick={() => setOpen(false)}
          >
            Change password
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-clay-600 hover:bg-clay-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
