import { useEffect, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

export default function Income() {
  const [income, setIncome] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    categoryId: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    recurring: false,
    recurrenceType: "NONE"
  });

  const load = async () => {
    const [incomeResponse, categoryResponse] = await Promise.all([api.get("/income"), api.get("/categories")]);
    setIncome(incomeResponse.data);
    const incomeCategories = categoryResponse.data.filter((category) => category.type === "INCOME");
    setCategories(incomeCategories);
    if (!form.categoryId && incomeCategories[0]) {
      setForm((current) => ({ ...current, categoryId: incomeCategories[0].id }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/income", { ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: "", description: "" });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/income/${id}`);
    load();
  };

  return (
    <section>
      <PageHeader title="Income" description="Add salary, freelance, business, and recurring income." />
      <MoneyForm form={form} setForm={setForm} categories={categories} onSubmit={submit} buttonLabel="Add Income" />
      <DataTable
        columns={[
          { key: "amount", label: "Amount" },
          { key: "categoryName", label: "Category" },
          { key: "date", label: "Date" },
          { key: "description", label: "Description" }
        ]}
        rows={income}
        onDelete={remove}
      />
    </section>
  );
}

function MoneyForm({ form, setForm, categories, onSubmit, buttonLabel }) {
  return (
    <form onSubmit={onSubmit} className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Amount" type="number" required />
        <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" required>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
        <input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
        <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Description" />
      </div>
      <button className="mt-4 rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">{buttonLabel}</button>
    </form>
  );
}
