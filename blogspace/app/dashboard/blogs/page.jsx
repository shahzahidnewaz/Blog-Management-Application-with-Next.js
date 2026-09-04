"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import Alert from "@/components/Alert";
import { useAuth } from "@/context/AuthContext";
import { getAllBlogs, deleteBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/services/api";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function BlogsContent() {
  const { user, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");

  function load() {
    setLoading(true);
    setError("");
    getAllBlogs()
      .then((res) => setBlogs(res.data || []))
      .catch((err) => setError(getErrorMessage(err, "Couldn't load blogs.")))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const visibleBlogs = isAdmin ? blogs : blogs.filter((b) => b.userId === user?.id);

  async function handleDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteBlog(pendingDelete.id);
      setBlogs((prev) => prev.filter((b) => b.id !== pendingDelete.id));
      setNotice("Blog deleted.");
      setPendingDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't delete this blog."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink-900">{isAdmin ? "All blogs" : "My blogs"}</h1>
        <Link
          href="/dashboard/blogs/create"
          className="px-4 py-2 text-sm rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700"
        >
          Create blog
        </Link>
      </div>

      <Alert type="error">{error}</Alert>
      <div className="mb-4">
        <Alert type="success">{notice}</Alert>
      </div>

      {loading ? (
        <Loader label="Loading blogs..." />
      ) : visibleBlogs.length === 0 ? (
        <EmptyState
          title="You haven't created any blogs yet."
          description="Create your first post to see it listed here."
        />
      ) : (
        <div className="border border-ink-200 rounded-lg bg-white overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-ink-500">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                {isAdmin && <th className="px-4 py-3 font-medium">Author</th>}
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleBlogs.map((blog) => (
                <tr key={blog.id} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/blogs/${blog.id}`} className="text-ink-800 hover:text-moss-700 font-medium">
                      {blog.blogTitle}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-500">{blog.category || "-"}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-ink-500">
                      {blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "-"}
                    </td>
                  )}
                  <td className="px-4 py-3 text-ink-500">{formatDate(blog.createAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        href={`/dashboard/blogs/${blog.id}/edit`}
                        className="text-moss-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(blog)}
                        className="text-clay-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this blog?"
        description={`"${pendingDelete?.blogTitle}" will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete"
        danger
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

export default function DashboardBlogsPage() {
  return (
    <DashboardShell>
      <BlogsContent />
    </DashboardShell>
  );
}
