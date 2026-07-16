import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CalendarDays, CalendarRange, CalendarSearch, CalendarClock } from "lucide-react";
import PageHeader from "../../components/PageHeader.jsx";
import api from "../../services/api.js";

const colors = ["#62D0C3", "#7062D8", "#C96A95", "#B98D48" , "#da4932", "#5ca36a", "#9d33a9", "#e6c300", "#1f77b4", "#ff7f0e", "#2ca02c",  "#8c564b",  "#7f7f7f",  ];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    summary: { income: 0, expenses: 0, balance: 0 },
    expenseByCategory: [],
    expensePeriods: { today: 0, week: 0, month: 0, year: 0 }
  });
  const chartData = dashboard.expenseByCategory.map((item) => ({ name: item.category, value: Number(item.amount) }));
  const expensePeriods = dashboard.expensePeriods || { today: 0, week: 0, month: 0, year: 0 };

  useEffect(() => {
    api.get("/dashboard").then((response) => setDashboard(response.data));
  }, []);

  return (
    <section>
      <PageHeader title="Dashboard" description="Track income, spending, balance, and category usage." />

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Income" value={money(dashboard.summary.income)} />
        <SummaryCard label="Expenses" value={money(dashboard.summary.expenses)} />
        <SummaryCard label="Balance" value={money(dashboard.summary.balance)} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <ExpenseCard label="Today" value={money(expensePeriods.today)} icon={CalendarDays} />
          <ExpenseCard label="This Week" value={money(expensePeriods.week)} icon={CalendarRange} />
          <ExpenseCard label="This Month" value={money(expensePeriods.month)} icon={CalendarSearch} />
          <ExpenseCard label="This Year" value={money(expensePeriods.year)} icon={CalendarClock} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Expense by Category</h3>
          <div className="h-[344px]">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={108} label>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center text-sm text-slate-500">Add expenses to see the chart.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function ExpenseCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-500">{label} Expense</p>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-500/10 text-rose-300">
          <Icon size={18} />
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
