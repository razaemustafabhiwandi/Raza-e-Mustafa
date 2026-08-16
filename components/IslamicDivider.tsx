export default function IslamicDivider() {
  return (
    <div className="my-10 flex items-center gap-4" aria-hidden="true">
      <span className="h-px flex-1 bg-primary/15" />
      <svg
        viewBox="0 0 40 40"
        className="h-5 w-5 shrink-0 text-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="8" y="8" width="24" height="24" />
        <rect x="8" y="8" width="24" height="24" transform="rotate(45 20 20)" />
      </svg>
      <span className="h-px flex-1 bg-primary/15" />
    </div>
  );
}
