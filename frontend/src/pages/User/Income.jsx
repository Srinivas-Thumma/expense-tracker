import { useEffect, useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import DataTable from "../../components/DataTable.jsx";
import Modal from "../../components/Modal.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatCard from "../../components/StatCard.jsx";
import api from "../../services/api.js";

const emptyForm = {
  amount: "",
  categoryId: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  recurring: false,
  recurrenceType: "NONE"
};

export default function Income() {
  const [income, setIncome] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [incomeResponse, categoryResponse] = await Promise.all([api.get("/income"), api.get("/categories")]);
    const incomeCategories = categoryResponse.data.filter((category) => category.type === "INCOME");
    setIncome(incomeResponse.data);
    setCategories(incomeCategories);
    setForm((current) => ({ ...current, categoryId: current.categoryId || incomeCategories[0]?.id || "" }));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing({ mode: "create" });
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
  };

  const openEdit = (row) => {
    setEditing({ mode: "edit", id: row.id });
    setForm({
      amount: row.amount || "",
      categoryId: row.categoryId || categories[0]?.id || "",
      date: row.date || emptyForm.date,
      description: row.description || "",
      recurring: row.recurring || false,
      recurrenceType: row.recurrenceType || "NONE"
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, amount: Number(form.amount) };
    if (editing?.mode === "edit") {
      await api.put(`/income/${editing.id}`, payload);
    } else {
      await api.post("/income", payload);
    }
    setEditing(null);
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/income/${id}`);
    load();
  };

  const total = income.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <section>
      <PageHeader
        title="Income"
        description="Track salary, investments, freelance, and recurring inflows."
        actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"><Plus size={16} /> Add Income</button>}
      />
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Income" value={money(total)} icon={TrendingUp} tone="emerald" />
        <StatCard title="Records" value={income.length} icon={TrendingUp} tone="blue" />
        <StatCard title="Categories" value={categories.length} icon={TrendingUp} tone="amber" />
      </div>
      <DataTable
        columns={[
          { key: "amount", label: "Amount", render: (row) => money(row.amount) },
          { key: "categoryName", label: "Category" },
          { key: "date", label: "Date" },
          { key: "description", label: "Description" }
        ]}
        rows={income}
        onEdit={openEdit}
        onDelete={remove}
      />
      {editing && <MoneyModal title={editing.mode === "edit" ? "Edit Income" : "Add Income"} form={form} setForm={setForm} categories={categories} onSubmit={submit} onClose={() => setEditing(null)} />}
    </section>
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

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0));
}
