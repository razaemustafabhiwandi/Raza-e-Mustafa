export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="glow-card flex flex-col items-center gap-2 rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="rounded-lg bg-gold px-3 py-1 text-2xl font-black text-primary-dark">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-sm font-medium text-primary/70">{label}</div>
    </div>
  );
}
