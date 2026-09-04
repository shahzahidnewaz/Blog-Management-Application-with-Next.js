import Link from "next/link";
import Avatar from "./Avatar";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function preview(text, length = 140) {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > length ? `${clean.slice(0, length)}...` : clean;
}

export default function BlogCard({ blog }) {
  const author = blog.author;
  return (
    <article className="flex flex-col border border-ink-200 rounded-lg bg-white p-5 hover:border-moss-400 transition-colors">
      {blog.category && (
        <span className="self-start text-xs uppercase tracking-wide text-moss-700 bg-moss-50 border border-moss-100 rounded-full px-2.5 py-1 mb-3">
          {blog.category}
        </span>
      )}
      <h3 className="font-display text-xl text-ink-900 leading-snug">
        <Link href={`/blogs/${blog.id}`} className="hover:underline">
          {blog.blogTitle}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-ink-500 line-clamp-3">{preview(blog.blog)}</p>

      <div className="mt-5 pt-4 border-t border-ink-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Avatar user={author} size={28} />
          <div className="min-w-0">
            <p className="text-sm text-ink-800 truncate">
              {author ? `${author.firstname} ${author.lastname}` : "Unknown author"}
            </p>
            <p className="text-xs text-ink-400">{formatDate(blog.createAt)}</p>
          </div>
        </div>
        <Link
          href={`/blogs/${blog.id}`}
          className="text-sm text-moss-700 font-medium hover:text-moss-900 shrink-0"
        >
          Read more &rarr;
        </Link>
      </div>
    </article>
  );
}
