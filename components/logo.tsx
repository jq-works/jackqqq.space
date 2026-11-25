// Doodle-style logo: a tilted outlined tile with "JQ!" only.
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-grid -rotate-6 place-items-center rounded-xl border-2 border-ink bg-ink text-paper font-extrabold tracking-tight ${className}`} aria-hidden>
      JQ!
    </span>
  );
}
