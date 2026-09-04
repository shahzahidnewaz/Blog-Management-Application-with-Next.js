"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import CategoryFilter from "@/components/CategoryFilter";
import BlogCard from "@/components/BlogCard";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import Alert from "@/components/Alert";
import { getAllBlogs } from "@/services/blog.service";
import { getErrorMessage } from "@/services/api";

function HomeContent() {
  const searchParams = useSearchParams();
  const [title, setTitle] = useState(searchParams?.get("title") || "");
  const [category, setCategory] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(searchParams?.get("title") || "");
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getAllBlogs({ title, category })
      .then((res) => {
        if (active) setBlogs(res.data || []);
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err, "Couldn't load blogs."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [title, category]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <section className="mb-10">
        <h1 className="font-display text-4xl text-ink-900">Ideas worth building on</h1>
        <p className="mt-3 text-ink-500 max-w-xl">
          Field notes on testing, automation, and the tools people build to ship with confidence.
        </p>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-6">
        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Loader label="Loading blogs..." />
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No blogs found"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <PublicShell>
      <Suspense fallback={<Loader label="Loading blogs..." />}>
        <HomeContent />
      </Suspense>
    </PublicShell>
  );
}
