import { useEffect, useState } from "react";
import { ArrowDownCircle, Eye, Plus, Receipt, Shield, Users, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import api from "../../services/api";

const emptyForm = { name: "", email: "", password: "", role: "ROLE_USER" };

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    loadUsers();
  }, []);

  async function loadDashboard() {
    const res = await api.get("/admin/dashboard");
    setDashboard(res.data);
  }

  async function loadUsers() {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  }

  async function createUser(event) {
    event.preventDefault();
    await api.post("/admin/users", form);
    setShowAdd(false);
    setForm(emptyForm);
    loadUsers();
    loadDashboard();
  }

  async function changeRole(id, role) {
    await api.put(`/admin/users/${id}/role`, { role: role === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN" });
    loadUsers();
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
    loadDashboard();
  }

  if (!dashboard) return <p className="text-sm text-slate-500">Loading dashboard...</p>;

  return (
    <section>
      <PageHeader
        title="Expense Tracker"
        description="Platform-level users, totals, and transaction activity."
        actions={<button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16} /> Add New User</button>}
      />
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard title="Users" value={dashboard.totalUsers} icon={Users} tone="blue" />
        <StatCard title="Transactions" value={dashboard.totalTransactions} icon={Receipt} tone="violet" />
        <StatCard title="Income" value={money(dashboard.totalIncome)} icon={Wallet} tone="emerald" />
        <StatCard title="Expenses" value={money(dashboard.totalExpenses)} icon={ArrowDownCircle} tone="rose" />
      </div>

      <div className="mt-6">
        <PageHeader title="Recent Users" />
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role", render: (user) => <RoleBadge user={user} /> },
            { key: "status", label: "Status", render: (user) => <StatusBadge user={user} /> }
          ]}
          rows={users.slice(0, 8)}
          onDelete={deleteUser}
          actions={(user) => (
            <>
              <button title="Change role" onClick={() => changeRole(user.id, user.role)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50">
                <Shield size={15} />
              </button>
              <button title="View user" onClick={() => navigate(`/admin/users/${user.id}`)} className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100">
                <Eye size={15} />
              </button>
            </>
          )}
        />
      </div>

      {showAdd && (
        <Modal title="Add New User" onClose={() => setShowAdd(false)}>
          <form onSubmit={createUser} className="grid gap-4">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Name" required />
            <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Email" type="email" required />
            <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Password" type="password" required />
            <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2">
              <option value="ROLE_USER">User</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
            <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white">Save User</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function RoleBadge({ user }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === "ROLE_ADMIN" ? "bg-sky-500/10 text-sky-300" : "bg-violet-500/10 text-violet-300"}`}>{user.role.replace("ROLE_", "")}</span>;
}

function StatusBadge({ user }) {
  const locked = user.email?.startsWith("locked.") || user.name?.toLowerCase().includes("locked");
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${locked ? "bg-red-500/10 text-red-300" : "bg-teal-500/10 text-teal-300"}`}>{locked ? "Locked" : "Active"}</span>;
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
