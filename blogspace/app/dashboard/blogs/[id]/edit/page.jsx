"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import BlogForm from "@/components/BlogForm";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { getBlogById, updateBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/services/api";

function EditBlogContent() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getBlogById(id)
      .then((res) => {
        if (active) setBlog(res.data);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't load this blog."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  async function handleSubmit(values) {
    try {
      await updateBlog(id, values);
      router.push(`/blogs/${id}`);
    } catch (err) {
      throw new Error(getErrorMessage(err, "You are not authorized to update this blog."));
    }
  }

  if (loading) return <Loader label="Loading blog..." />;
  if (error || !blog) {
    return <EmptyState title="Blog not found" description={error || "This blog doesn't exist."} />;
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink-900 mb-6">Edit blog</h1>
      <BlogForm
        initialValues={blog}
        submitLabel="Save changes"
        pendingLabel="Saving..."
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default function EditBlogPage() {
  return (
    <DashboardShell>
      <EditBlogContent />
    </DashboardShell>
  );
}
