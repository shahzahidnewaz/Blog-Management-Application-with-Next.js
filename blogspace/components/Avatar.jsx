import Image from "next/image";
import { resolveImageUrl } from "@/lib/apiConfig";

function initialsFor(user) {
  if (!user) return "?";
  const a = user.firstname?.[0] || "";
  const b = user.lastname?.[0] || "";
  return (a + b).toUpperCase() || "?";
}

export default function Avatar({ user, size = 36 }) {
  const src = resolveImageUrl(user?.image);
  const style = { width: size, height: size };

  if (src) {
    return (
      <Image
        src={src}
        alt={`${user?.firstname || "User"}'s avatar`}
        width={size}
        height={size}
        style={style}
        className="rounded-full object-cover border border-ink-200 shrink-0"
        unoptimized
      />
    );
  }

  return (
    <div
      style={style}
      className="rounded-full bg-moss-600 text-paper flex items-center justify-center font-medium shrink-0"
    >
      <span style={{ fontSize: Math.max(11, size * 0.38) }}>{initialsFor(user)}</span>
    </div>
  );
}
