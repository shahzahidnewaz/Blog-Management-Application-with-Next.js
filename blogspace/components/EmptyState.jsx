export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-ink-200 rounded-lg bg-white/50">
      <p className="font-display text-xl text-ink-800">{title}</p>
      {description && <p className="mt-2 text-ink-500 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
