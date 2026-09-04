export default function Alert({ type = "error", children }) {
  if (!children) return null;
  const styles = {
    error: "bg-clay-50 border-clay-200 text-clay-700",
    success: "bg-moss-50 border-moss-200 text-moss-700",
    info: "bg-ink-100 border-ink-200 text-ink-700",
  };
  return (
    <div className={`border rounded-md px-4 py-3 text-sm ${styles[type]}`} role="status">
      {children}
    </div>
  );
}
