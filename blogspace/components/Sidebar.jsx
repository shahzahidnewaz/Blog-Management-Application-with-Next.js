"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  User,
  Lock,
  Users,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const USER_LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/blogs", label: "My blogs", Icon: FileText },
  { href: "/dashboard/blogs/create", label: "Create blog", Icon: Plus },
  { href: "/dashboard/profile", label: "Profile", Icon: User },
  { href: "/dashboard/change-password", label: "Change password", Icon: Lock },
];

const ADMIN_LINKS = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/dashboard/blogs", label: "All blogs", Icon: FileText },
  { href: "/dashboard/blogs/create", label: "Create blog", Icon: Plus },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/dashboard/profile", label: "Profile", Icon: User },
  { href: "/dashboard/change-password", label: "Change password", Icon: Lock },
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();
  const router = useRouter();
  const links = isAdmin ? ADMIN_LINKS : USER_LINKS;

  function handleLogout() {
    logout();
    onClose?.();
    router.push("/login");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-ink-950/40 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-ink-200 z-40 transform transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 flex flex-col gap-1 h-full">
          {links.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-moss-50 text-moss-800 font-medium border border-moss-100"
                    : "text-ink-600 hover:bg-ink-50"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-clay-600 hover:bg-clay-50"
          >
            <LogOut size={18} aria-hidden="true" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
