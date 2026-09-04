"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PublicShell from "@/components/PublicShell";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";
import EmptyState from "@/components/EmptyState";
import { getBlogById } from "@/services/blog.service";
import { getErrorMessage } from "@/services/api";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getBlogById(id)
      .then((res) => {
        if (active) setBlog(res.data);
      })
      .catch((err) => {
        if (!active) return;
        if (err.response?.status === 404 || err.response?.status === 400) {
          setNotFound(true);
        } else {
          setError(getErrorMessage(err, "Couldn't load this blog."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  return (
    <PublicShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {loading && <Loader label="Loading blog..." />}

        {!loading && notFound && (
          <EmptyState
            title="Blog Not Found"
            description="This blog may have been removed or the link is incorrect."
          />
        )}

        {!loading && !notFound && error && (
          <EmptyState title="Something went wrong" description={error} />
        )}

        {!loading && !notFound && !error && blog && (
          <article>
            {blog.category && (
              <span className="inline-block text-xs uppercase tracking-wide text-moss-700 bg-moss-50 border border-moss-100 rounded-full px-2.5 py-1 mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl text-ink-900 leading-tight">
              {blog.blogTitle}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <Avatar user={blog.author} size={40} />
              <div>
                <p className="text-sm font-medium text-ink-800">
                  {blog.author ? `${blog.author.firstname} ${blog.author.lastname}` : "Unknown author"}
                </p>
                <p className="text-xs text-ink-400">{formatDate(blog.createAt)}</p>
              </div>
            </div>

            <div className="mt-8 text-ink-700 leading-relaxed whitespace-pre-wrap">
              {blog.blog}
            </div>
          </article>
        )}
      </div>
    </PublicShell>
  );
}
