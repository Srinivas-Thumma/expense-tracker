import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, Phone, Plus, Receipt, Shield, Target, TrendingUp, UserCircle } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import api, { API_ORIGIN } from "../../services/api";

const emptyMoneyForm = {
  amount: "",
  categoryId: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  recurring: false,
  recurrenceType: "NONE"
};

const emptyBudgetForm = {
  budgetType: "Monthly",
  amount: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10)
};

export default function UserDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const [moneyForm, setMoneyForm] = useState(emptyMoneyForm);
  const [budgetForm, setBudgetForm] = useState(emptyBudgetForm);

  const loadData = async () => {
    const [userResponse, categoryResponse] = await Promise.all([
      api.get(`/admin/users/${id}`),
      api.get("/categories")
    ]);
    setData(userResponse.data);
    setCategories(categoryResponse.data);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!data) return <p className="text-sm text-slate-500">Loading user...</p>;

  const openMoneyCreate = (kind) => {
    const type = kind === "income" ? "INCOME" : "EXPENSE";
    const firstCategory = categories.find((category) => category.type === type);
    setMoneyForm({ ...emptyMoneyForm, categoryId: firstCategory?.id || "" });
    setEditing({ kind, mode: "create" });
  };

  const openMoneyEdit = (kind, row) => {
    const type = kind === "income" ? "INCOME" : "EXPENSE";
    const firstCategory = categories.find((category) => category.type === type);
    setMoneyForm({
      amount: row.amount || "",
      categoryId: row.categoryId || firstCategory?.id || "",
      date: row.date || emptyMoneyForm.date,
      description: row.description || "",
      recurring: row.recurring || false,
      recurrenceType: row.recurrenceType || "NONE"
    });
    setEditing({ kind, mode: "edit", id: row.id });
  };

  const submitMoney = async (event) => {
    event.preventDefault();
    const payload = { ...moneyForm, amount: Number(moneyForm.amount) };
    if (editing.mode === "edit") {
      await api.put(`/admin/users/${id}/${editing.kind}/${editing.id}`, payload);
    } else {
      await api.post(`/admin/users/${id}/${editing.kind}`, payload);
    }
    setEditing(null);
    await loadData();
  };

  const removeMoney = async (kind, recordId) => {
    if (!window.confirm("Delete this record?")) return;
    await api.delete(`/admin/users/${id}/${kind}/${recordId}`);
    await loadData();
  };

  const openBudgetCreate = () => {
    setBudgetForm(emptyBudgetForm);
    setEditing({ kind: "budgets", mode: "create" });
  };

  const openBudgetEdit = (row) => {
    setBudgetForm({
      budgetType: row.budgetType || "Monthly",
      amount: row.amount || "",
      startDate: row.startDate || emptyBudgetForm.startDate,
      endDate: row.endDate || emptyBudgetForm.endDate
    });
    setEditing({ kind: "budgets", mode: "edit", id: row.id });
  };

  const submitBudget = async (event) => {
    event.preventDefault();
    const payload = { ...budgetForm, amount: Number(budgetForm.amount) };
    if (editing.mode === "edit") {
      await api.put(`/admin/users/${id}/budgets/${editing.id}`, payload);
    } else {
      await api.post(`/admin/users/${id}/budgets`, payload);
    }
    setEditing(null);
    await loadData();
  };

  const removeBudget = async (recordId) => {
    if (!window.confirm("Delete this budget?")) return;
    await api.delete(`/admin/users/${id}/budgets/${recordId}`);
    await loadData();
  };

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
        <Panel title="Expenses" onAdd={() => openMoneyCreate("expenses")} actionLabel="Add Expense">
          <DataTable
            columns={moneyColumns}
            rows={data.expenses}
            onEdit={(row) => openMoneyEdit("expenses", row)}
            onDelete={(recordId) => removeMoney("expenses", recordId)}
          />
        </Panel>
        <Panel title="Income" onAdd={() => openMoneyCreate("income")} actionLabel="Add Income">
          <DataTable
            columns={moneyColumns}
            rows={data.income}
            onEdit={(row) => openMoneyEdit("income", row)}
            onDelete={(recordId) => removeMoney("income", recordId)}
          />
        </Panel>
      </div>
      <div className="mt-6">
        <Panel title="Budgets" onAdd={openBudgetCreate} actionLabel="Add Budget">
          <DataTable
            columns={[
              { key: "budgetType", label: "Type" },
              { key: "amount", label: "Amount", render: (row) => money(row.amount) },
              { key: "startDate", label: "Start" },
              { key: "endDate", label: "End" }
            ]}
            rows={data.budgets}
            onEdit={openBudgetEdit}
            onDelete={removeBudget}
          />
        </Panel>
      </div>

      {editing?.kind !== "budgets" && editing && (
        <MoneyModal
          title={`${editing.mode === "edit" ? "Edit" : "Add"} ${editing.kind === "income" ? "Income" : "Expense"}`}
          form={moneyForm}
          setForm={setMoneyForm}
          categories={categories.filter((category) => category.type === (editing.kind === "income" ? "INCOME" : "EXPENSE"))}
          onSubmit={submitMoney}
          onClose={() => setEditing(null)}
        />
      )}

      {editing?.kind === "budgets" && (
        <BudgetModal
          title={editing.mode === "edit" ? "Edit Budget" : "Add Budget"}
          form={budgetForm}
          setForm={setBudgetForm}
          onSubmit={submitBudget}
          onClose={() => setEditing(null)}
        />
      )}
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

function Panel({ title, children, onAdd, actionLabel }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-950">{title}</h3>
        {onAdd && (
          <button onClick={onAdd} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">
            <Plus size={14} />
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function MoneyModal({ title, form, setForm, categories, onSubmit, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Amount" type="number" required />
        <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" required>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
        <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Description" />
        <button className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Save</button>
      </form>
    </Modal>
  );
}

function BudgetModal({ title, form, setForm, onSubmit, onClose }) {
  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={onSubmit} className="grid gap-4">
        <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Budget amount" type="number" required />
        <input value={form.budgetType} onChange={(event) => setForm({ ...form, budgetType: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Budget type" required />
        <input value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
        <input value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
        <button className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Save</button>
      </form>
    </Modal>
  );
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
