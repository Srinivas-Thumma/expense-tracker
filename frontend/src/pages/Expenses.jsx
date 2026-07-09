import { useEffect, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
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
    const [expenseResponse, categoryResponse] = await Promise.all([api.get("/expenses"), api.get("/categories")]);
    setExpenses(expenseResponse.data);
    const expenseCategories = categoryResponse.data.filter((category) => category.type === "EXPENSE");
    setCategories(expenseCategories);
    if (!form.categoryId && expenseCategories[0]) {
      setForm((current) => ({ ...current, categoryId: expenseCategories[0].id }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/expenses", { ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: "", description: "" });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/expenses/${id}`);
    load();
  };

  return (
    <section>
      <PageHeader title="Expenses" description="Add expenses, search records, and filter by category or date." />
      <form onSubmit={submit} className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Amount" type="number" required />
          <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" required>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
          <input value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
          <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Description" />
        </div>
        <button className="mt-4 rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Add Expense</button>
      </form>
      <DataTable
        columns={[
          { key: "amount", label: "Amount" },
          { key: "categoryName", label: "Category" },
          { key: "date", label: "Date" },
          { key: "description", label: "Description" }
        ]}
        rows={expenses}
        onDelete={remove}
      />
    </section>
  );
}
