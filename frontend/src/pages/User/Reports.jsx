import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PieChart as PieIcon, Receipt, TrendingUp, Wallet } from "lucide-react";
import DataTable from "../../components/DataTable.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../services/api.js";

const colors = ["#62D0C3", "#7062D8", "#C96A95", "#B98D48", "#5BAFC0", "#8B7AE6", "#D0666A"];

export default function Reports() {
  const [report, setReport] = useState({ summary: { income: 0, expenses: 0, balance: 0 }, expenseByCategory: [], incomeByCategory: [], monthlyTrend: [], recentTransactions: [] });
  const now = new Date();

  useEffect(() => {
    api.get(`/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`).then((response) => setReport(response.data));
  }, []);

  const pieData = report.expenseByCategory.map((item) => ({ name: item.category, value: Number(item.amount) }));
  const topCategories = [...report.expenseByCategory].slice(0, 5);

  return (
    <section>
      <PageHeader title="Reports" description="Monthly income, expenses, category split, top spend, and recent transactions." />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Monthly Income" value={money(report.summary.income)} icon={TrendingUp} tone="emerald" />
        <StatCard title="Monthly Expense" value={money(report.summary.expenses)} icon={Receipt} tone="rose" />
        <StatCard title="Monthly Balance" value={money(report.summary.balance)} icon={Wallet} tone="blue" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-950"><PieIcon size={18} /> Category Pie Chart</h3>
          <div className="h-80">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={105} label>
                    {pieData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => money(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : <EmptyChart />}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-950">Six Month Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.monthlyTrend}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => money(value)} />
                <Legend />
                <Bar dataKey="income" fill="#62D0C3" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill="#C96A95" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-950">Top Spending Categories</h3>
          <div className="space-y-3">
            {topCategories.length ? topCategories.map((item, index) => (
              <div key={item.category}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.category}</span>
                  <span className="text-slate-500">{money(item.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${Math.max(8, (Number(item.amount) / Number(topCategories[0].amount || 1)) * 100)}%` }} />
                </div>
              </div>
            )) : <p className="text-sm text-slate-500">No expenses this month.</p>}
          </div>
        </div>

        <DataTable
          columns={[
            { key: "kind", label: "Type" },
            { key: "categoryName", label: "Category" },
            { key: "amount", label: "Amount", render: (row) => money(row.amount) },
            { key: "date", label: "Date" },
            { key: "description", label: "Description" }
          ]}
          rows={report.recentTransactions}
          emptyText="No recent transactions this month."
        />
      </div>
    </section>
  );
}

function EmptyChart() {
  return <div className="grid h-full place-items-center text-sm text-slate-500">No chart data yet.</div>;
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
