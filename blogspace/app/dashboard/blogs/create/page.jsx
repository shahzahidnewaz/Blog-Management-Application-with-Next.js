"use client";

import { useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import BlogForm from "@/components/BlogForm";
import { createBlog } from "@/services/blog.service";
import { getErrorMessage } from "@/services/api";

function CreateBlogContent() {
  const router = useRouter();

  async function handleSubmit(values) {
    try {
      const res = await createBlog(values);
      router.push(`/blogs/${res.data.id}`);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Couldn't publish this blog."));
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-ink-900 mb-6">Create blog</h1>
      <BlogForm submitLabel="Publish blog" pendingLabel="Publishing..." onSubmit={handleSubmit} />
    </div>
  );
}

export default function CreateBlogPage() {
  return (
    <DashboardShell>
      <CreateBlogContent />
    </DashboardShell>
  );
}
