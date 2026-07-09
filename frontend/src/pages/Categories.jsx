import { useEffect, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", type: "EXPENSE" });

  const load = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/categories", form);
    setForm({ name: "", type: "EXPENSE" });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <section>
      <PageHeader title="Categories" description="Create income and expense categories." />
      <form onSubmit={submit} className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2"
            placeholder="Category name"
            required
          />
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option>EXPENSE</option>
            <option>INCOME</option>
          </select>
          <button className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Add</button>
        </div>
      </form>
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" }
        ]}
        rows={categories}
        onDelete={remove}
      />
    </section>
  );
}
