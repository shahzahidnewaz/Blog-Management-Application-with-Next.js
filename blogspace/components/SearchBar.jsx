"use client";

export default function SearchBar({ value, onChange, placeholder = "Search blogs..." }) {
  return (
    <div className="relative w-full">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search blogs"
        className="w-full rounded-md border border-ink-200 bg-white pl-4 pr-4 py-2.5 text-sm placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-moss-400 focus:border-moss-400"
      />
    </div>
  );
}
