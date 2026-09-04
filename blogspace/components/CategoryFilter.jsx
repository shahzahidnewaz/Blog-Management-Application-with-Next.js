"use client";

const DEFAULT_CATEGORIES = ["All", "Testing", "Automation", "Programming", "DevOps", "AI"];

export default function CategoryFilter({ value, onChange, categories = DEFAULT_CATEGORIES }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const active = value === cat || (cat === "All" && !value);
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              active
                ? "bg-moss-600 border-moss-600 text-paper"
                : "bg-white border-ink-200 text-ink-600 hover:border-moss-400"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

export { DEFAULT_CATEGORIES };
