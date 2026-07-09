import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

const colors = ["#059669", "#2563eb", "#f59e0b", "#dc2626"];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    summary: { income: 0, expenses: 0, balance: 0 },
    expenseByCategory: []
  });
  const chartData = dashboard.expenseByCategory.map((item) => ({ name: item.category, value: Number(item.amount) }));

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

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="mb-4 font-semibold">Expense by Category</h3>
        <div className="h-72">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={95} label>
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
