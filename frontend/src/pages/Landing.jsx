import { Check, LogIn, PieChart, ShieldCheck, Sparkles, UserPlus, Users, WalletCards } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const accountOptions = [
  { title: "Manage my own expenses", icon: WalletCards, tone: "border-teal-300/40 text-teal-200" },
  { title: "Cross-organization analytics", icon: Users, tone: "border-violet-300/40 text-violet-200" },
  { title: "Administer users", icon: ShieldCheck, tone: "border-sky-300/40 text-sky-200" }
];

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const openRegister = () => {
    const query = email ? `?mode=register&email=${encodeURIComponent(email)}` : "?mode=register";
    navigate(`/login${query}`);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070817] px-5 py-5 text-white sm:px-8 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(98,208,195,0.2),transparent_30%),radial-gradient(circle_at_82%_78%,rgba(112,98,216,0.28),transparent_34%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(120deg,rgba(98,208,195,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:80px_80px]" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-40px)] max-w-7xl items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-lg border border-teal-300/40 bg-teal-300/10 text-teal-200 shadow-[0_0_24px_rgba(98,208,195,0.24)]">
              <PieChart size={22} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-wide text-teal-200">Expenza</h1>
          </div>

          <h2 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
            The smartest way to manage your <span className="text-violet-300">expenses</span>
          </h2>

          <div className="mt-8 grid gap-3 text-base font-medium text-slate-200">
            {[
              "Track income, expenses, and budget goals from one workspace.",
              "Securely manage users and categories with admin oversight.",
              "Review financial trends with clear reports and charts."
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 shrink-0 text-teal-200" size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {accountOptions.map(({ title, icon: Icon, tone }) => (
              <button
                key={title}
                onClick={openRegister}
                className={`min-h-[104px] rounded-lg border bg-white/[0.04] p-4 text-left shadow-[0_0_28px_rgba(98,208,195,0.08)] transition hover:-translate-y-0.5 hover:bg-white/[0.07] ${tone}`}
              >
                <Icon size={24} />
                <span className="mt-4 block text-sm font-bold leading-snug text-white">{title}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-full border border-sky-300/50 bg-[#0b1430]/80 p-2 shadow-[0_0_28px_rgba(98,208,195,0.18)] sm:flex-row">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-12 flex-1 rounded-full border-0 bg-transparent px-5 text-white outline-none"
              placeholder="Enter your email"
              type="email"
            />
            <button onClick={openRegister} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal-700 px-7 text-sm font-black text-slate-950 shadow-[0_0_18px_rgba(98,208,195,0.65)] hover:bg-teal-500">
              <UserPlus size={17} />
              Get started 
            </button>
          </div>

          <button onClick={() => navigate("/login")} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-200 hover:text-white">
            <LogIn size={36} />
            Already have an account? Log in
          </button>
        </div>

        <div className="relative hidden min-h-[520px] lg:block">
          <div className="absolute right-0 top-6 w-[88%] rounded-lg border border-sky-300/15 bg-[#0c1026]/95 p-5 shadow-[0_0_50px_rgba(112,98,216,0.28)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-teal-200">Report</p>
                <p className="text-xs text-slate-400">Secure finance overview</p>
              </div>
              <Sparkles className="text-teal-200" size={20} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Income", "75,900.06", "text-teal-200"],
                ["Expense", "75,000.00", "text-rose-200"],
                ["Balance", "900.06", "text-sky-200"]
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs font-bold text-slate-300">{label}</p>
                  <p className={`mt-2 text-lg font-black ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <LineGraphCard title="Monthly Expense Trend" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <ChartCard title="Expense by Category" />
              <BarCard title="Income vs. Expenses" />
            </div>
          </div>
          <div className="absolute bottom-12 left-4 w-[42%] rotate-[-3deg] rounded-lg border border-violet-300/20 bg-[#10132d] p-4 shadow-[0_0_40px_rgba(112,98,216,0.35)]">
            <ChartCard title="Categories" compact />
          </div>
        </div>
      </section>
    </main>
  );
}

function LineGraphCard({ title }) {
  const points = [
    [0, 72],
    [42, 54],
    [84, 62],
    [126, 38],
    [168, 44],
    [210, 24],
    [252, 34],
    [294, 18],
    [336, 28]
  ];
  const line = points.map(([x, y]) => `${x},${y}`).join(" ");
  const area = `0,112 ${line} 336,112`;

  return (
    <div className="rounded-lg border border-white/10 bg-[#070817] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-bold text-slate-200">{title}</p>
        <span className="rounded-full bg-teal-300/10 px-2 py-1 text-[10px] font-bold text-teal-200">Live</span>
      </div>
      <svg viewBox="0 0 336 120" role="img" aria-label={title} className="h-32 w-full overflow-visible">
        {[28, 56, 84, 112].map((y) => (
          <line key={y} x1="0" x2="336" y1={y} y2={y} stroke="rgba(148,163,184,0.16)" strokeWidth="1" />
        ))}
        <polygon points={area} fill="rgba(98,208,195,0.12)" />
        <polyline points={line} fill="none" stroke="#62d0c3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="0,88 42,82 84,91 126,76 168,86 210,66 252,74 294,58 336,63" fill="none" stroke="#7062d8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
        {points.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#070817" stroke="#62d0c3" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}

function ChartCard({ title, compact = false }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#070817] p-4">
      <p className="mb-3 text-xs font-bold text-slate-200">{title}</p>
      <div className={`mx-auto rounded-full ${compact ? "h-28 w-28" : "h-36 w-36"} bg-[conic-gradient(#62d0c3_0_32%,#7062d8_32%_58%,#e35b61_58%_82%,#f4b860_82%_100%)] shadow-[0_0_24px_rgba(98,208,195,0.18)]`} />
    </div>
  );
}

function BarCard({ title }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#070817] p-4">
      <p className="mb-4 text-xs font-bold text-slate-200">{title}</p>
      <div className="flex h-36 items-end gap-3">
        {[44, 72, 58, 86, 64, 76].map((height, index) => (
          <div key={index} className="flex flex-1 flex-col justify-end">
            <div className="rounded-t bg-gradient-to-t from-violet-500 to-teal-300" style={{ height: `${height}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}
