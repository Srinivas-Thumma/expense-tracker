import { useEffect, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownCircle, Receipt, Users, Wallet } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import api from "../../services/api";

export default function AdminReports() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then((response) => setDashboard(response.data));
  }, []);

  if (!dashboard) return <p className="text-sm text-slate-500">Loading reports...</p>;

  return (
    <section>
      <PageHeader title="Reports" description="Application-level reporting and six-month financial trend." />

      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Users" value={dashboard.totalUsers} icon={Users} tone="blue" />
        <StatCard title="Transactions" value={dashboard.totalTransactions} icon={Receipt} tone="violet" />
        <StatCard title="Income" value={money(dashboard.totalIncome)} icon={Wallet} tone="emerald" />
        <StatCard title="Expenses" value={money(dashboard.totalExpenses)} icon={ArrowDownCircle} tone="rose" />
      </div>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-950">Income vs. Expenses</h3>
          <p className="text-sm text-slate-500">Last 6 months</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.monthlyTrend || []}>
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
    </section>
  );
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
