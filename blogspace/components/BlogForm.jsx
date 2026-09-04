"use client";

import { useState } from "react";
import Alert from "./Alert";
import { DEFAULT_CATEGORIES } from "./CategoryFilter";

const CATEGORY_OPTIONS = DEFAULT_CATEGORIES.filter((c) => c !== "All");

const UNCATEGORIZED = "Uncategorized";

export default function BlogForm({ initialValues, submitLabel, pendingLabel, onSubmit }) {
  const initialCategory = initialValues
    ? initialValues.category?.trim() || UNCATEGORIZED
    : CATEGORY_OPTIONS[0];
  const categoryOptions = CATEGORY_OPTIONS.includes(initialCategory)
    ? CATEGORY_OPTIONS
    : [initialCategory, ...CATEGORY_OPTIONS];

  const [blogTitle, setBlogTitle] = useState(initialValues?.blogTitle || "");
  const [category, setCategory] = useState(initialCategory);
  const [blog, setBlog] = useState(initialValues?.blog || "");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!blogTitle.trim()) next.blogTitle = "Blog title is required.";
    if (!category) next.category = "Choose a category.";
    if (!blog.trim() || blog.trim().length < 20) {
      next.blog = "Blog content should be at least 20 characters.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const categoryToSubmit = category === UNCATEGORIZED ? "" : category;
      await onSubmit({ blogTitle: blogTitle.trim(), blog: blog.trim(), category: categoryToSubmit });
    } catch (err) {
      setSubmitError(err.message || "Failed to save blog.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Alert type="error">{submitError}</Alert>

      <div>
        <label htmlFor="blogTitle" className="block text-sm font-medium text-ink-700 mb-1.5">
          Blog title
        </label>
        <input
          id="blogTitle"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          placeholder="Introduction to Playwright"
          className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-moss-400"
        />
        {errors.blogTitle && <p className="mt-1 text-sm text-clay-600">{errors.blogTitle}</p>}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-ink-700 mb-1.5">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-moss-400"
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-clay-600">{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="blog" className="block text-sm font-medium text-ink-700 mb-1.5">
          Blog content
        </label>
        <textarea
          id="blog"
          value={blog}
          onChange={(e) => setBlog(e.target.value)}
          rows={12}
          placeholder="Playwright is a modern browser automation framework..."
          className="w-full rounded-md border border-ink-200 px-3 py-2.5 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-moss-400"
        />
        {errors.blog && <p className="mt-1 text-sm text-clay-600">{errors.blog}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-moss-600 text-paper font-medium hover:bg-moss-700 disabled:opacity-60"
      >
        {submitting ? pendingLabel : submitLabel}
      </button>
    </form>
  );
}