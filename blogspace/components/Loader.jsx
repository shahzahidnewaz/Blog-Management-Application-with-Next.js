export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ink-500">
      <span
        className="inline-block h-5 w-5 rounded-full border-2 border-ink-300 border-t-moss-600 animate-spin"
        aria-hidden="true"
      />
      <span>{label}</span>
    </div>
  );
}
