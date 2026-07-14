import { useEffect, useState } from "react";
import { Plus, Target } from "lucide-react";
import DataTable from "../../components/DataTable.jsx";
import Modal from "../../components/Modal.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../services/api.js";

const emptyForm = {
  budgetType: "Monthly",
  amount: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10)
};

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const response = await api.get("/budgets");
    setBudgets(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing({ mode: "create" });
    setForm(emptyForm);
  };

  const openEdit = (row) => {
    setEditing({ mode: "edit", id: row.id });
    setForm({
      budgetType: row.budgetType || "Monthly",
      amount: row.amount || "",
      startDate: row.startDate || emptyForm.startDate,
      endDate: row.endDate || emptyForm.endDate
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (editing?.mode === "edit") {
      await api.put(`/budgets/${editing.id}`, payload);
    } else {
      await api.post("/budgets", payload);
    }
    setEditing(null);
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/budgets/${id}`);
    load();
  };

  const total = budgets.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <section>
      <PageHeader
        title="Budget"
        description="Set spending limits and keep monthly planning visible."
        actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><Plus size={16} /> Add Budget</button>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Budget" value={money(total)} icon={Target} tone="blue" />
        <StatCard title="Active Budgets" value={budgets.length} icon={Target} tone="emerald" />
        <StatCard title="Average Budget" value={money(budgets.length ? total / budgets.length : 0)} icon={Target} tone="amber" />
      </div>
      <DataTable
        columns={[
          { key: "budgetType", label: "Type" },
          { key: "amount", label: "Amount", render: (row) => money(row.amount) },
          { key: "startDate", label: "Start" },
          { key: "endDate", label: "End" }
        ]}
        rows={budgets}
        onEdit={openEdit}
        onDelete={remove}
      />
      {editing && (
        <Modal title={editing.mode === "edit" ? "Edit Budget" : "Add Budget"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="grid gap-4">
            <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Budget amount" type="number" required />
            <input value={form.budgetType} onChange={(event) => setForm({ ...form, budgetType: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Budget type" required />
            <input value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
            <input value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
            <button className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Save</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
