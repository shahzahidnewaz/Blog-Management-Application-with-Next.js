"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Avatar from "@/components/Avatar";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { getAllBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/services/api";

function DashboardContent() {
  const { user, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setError("");
    getAllBlogs()
      .then((res) => {
        if (active) setBlogs(res.data || []);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't load your blogs."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const myBlogs = blogs.filter((b) => b.userId === user?.id);
  const recent = (isAdmin ? blogs : myBlogs).slice(0, 3);
  const totalLabel = isAdmin ? "Total blogs" : "Your blogs";
  const totalCount = isAdmin ? blogs.length : myBlogs.length;

  return (
    <div>
      <div className="flex items-center gap-4">
        <Avatar user={user} size={56} />
        <div>
          <h1 className="font-display text-2xl text-ink-900">Welcome, {user?.firstname}</h1>
          <p className="text-sm text-ink-500 capitalize">{user?.role} account</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="border border-ink-200 rounded-lg bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink-400">{totalLabel}</p>
          <p className="mt-1 font-display text-3xl text-ink-900">{loading || error ? "-" : totalCount}</p>
        </div>
        <div className="border border-ink-200 rounded-lg bg-white p-5">
          <p className="text-xs uppercase tracking-wide text-ink-400">Email</p>
          <p className="mt-1 text-sm text-ink-700 truncate">{user?.email}</p>
        </div>
        <div className="border border-ink-200 rounded-lg bg-white p-5 flex items-center">
          <Link
            href="/dashboard/blogs/create"
            className="w-full text-center py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700"
          >
            Create blog
          </Link>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink-900 mb-4">
          {isAdmin ? "Recent blogs" : "Your recent blogs"}
        </h2>
        {loading ? (
          <Loader label="Loading..." />
        ) : error ? (
          <Alert type="error">{error}</Alert>
        ) : recent.length === 0 ? (
          <EmptyState
            title="You haven't created any blogs yet."
            description="Start writing to see it appear here."
            action={
              <Link href="/dashboard/blogs/create" className="text-moss-700 font-medium hover:underline">
                Create your first blog &rarr;
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recent.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardContent />
    </DashboardShell>
  );
}
