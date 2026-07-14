export default function StatCard({ title, value, icon: Icon, tone = "emerald" }) {
  const tones = {
    emerald: "bg-[rgba(0,255,198,0.12)] text-emerald-700",
    blue: "bg-[rgba(123,97,255,0.14)] text-sky-700",
    amber: "bg-[rgba(245,158,11,0.14)] text-amber-700",
    rose: "bg-[rgba(255,77,79,0.14)] text-rose-700",
    violet: "bg-[rgba(123,97,255,0.14)] text-violet-700"
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="mt-2 font-mono text-2xl font-medium text-slate-900">{value}</p>
        </div>
        {Icon && (
          <div className={`grid h-11 w-11 place-items-center rounded-lg ${tones[tone] || tones.emerald}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
    </div>
  );
}
