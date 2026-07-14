import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, Phone, Receipt, Shield, Target, TrendingUp, UserCircle } from "lucide-react";
import DataTable from "../../components/DataTable";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import api, { API_ORIGIN } from "../../services/api";

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/users/${id}`).then((response) => setData(response.data));
  }, [id]);

  if (!data) return <p className="text-sm text-slate-500">Loading user...</p>;

  return (
    <section>
      <PageHeader title="User Workspace" description="Profile, contact details, and finance records for this user." />

      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl(data.user)}
              alt=""
              className="h-20 w-20 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-950">{data.user.name}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${data.user.role === "ROLE_ADMIN" ? "bg-sky-500/10 text-sky-300" : "bg-violet-500/10 text-violet-300"}`}>
                  {data.user.role.replace("ROLE_", "")}
                </span>
                <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">Active</span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <Detail icon={Mail} label="Email" value={data.user.email} />
                <Detail icon={Phone} label="Phone" value={data.user.phone || "Not added"} />
                <Detail icon={Shield} label="Role" value={data.user.role.replace("ROLE_", "")} />
                <Detail icon={UserCircle} label="User ID" value={data.user.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Income" value={money(data.totalIncome)} icon={TrendingUp} tone="emerald" />
        <StatCard title="Expenses" value={money(data.totalExpenses)} icon={Receipt} tone="rose" />
        <StatCard title="Budget" value={money(data.totalBudget)} icon={Target} tone="blue" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Expenses">
          <DataTable columns={moneyColumns} rows={data.expenses} />
        </Panel>
        <Panel title="Income">
          <DataTable columns={moneyColumns} rows={data.income} />
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Budgets">
          <DataTable
            columns={[
              { key: "budgetType", label: "Type" },
              { key: "amount", label: "Amount", render: (row) => money(row.amount) },
              { key: "startDate", label: "Start" },
              { key: "endDate", label: "End" }
            ]}
            rows={data.budgets}
          />
        </Panel>
      </div>
    </section>
  );
}

function avatarUrl(user) {
  if (user.profilePicture) return `${API_ORIGIN}${user.profilePicture}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=0f172a&color=fff`;
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md bg-slate-50 px-3 py-2">
      <Icon size={16} className="shrink-0 text-slate-400" />
      <span className="shrink-0 font-medium text-slate-500">{label}:</span>
      <span className="truncate text-slate-800" title={value}>{value}</span>
    </div>
  );
}

const moneyColumns = [
  { key: "amount", label: "Amount", render: (row) => money(row.amount) },
  { key: "categoryName", label: "Category" },
  { key: "date", label: "Date" },
  { key: "description", label: "Description" }
];

function Panel({ title, children }) {
  return (
    <div>
      <h3 className="mb-3 font-semibold text-slate-950">{title}</h3>
      {children}
    </div>
  );
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
