export default function PageHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
