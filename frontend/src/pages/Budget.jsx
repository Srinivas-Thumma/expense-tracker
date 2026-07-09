import { useEffect, useState } from "react";
import DataTable from "../components/DataTable.jsx";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

export default function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({
    budgetType: "Monthly",
    amount: "",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10)
  });

  const load = async () => {
    const response = await api.get("/budgets");
    setBudgets(response.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post("/budgets", { ...form, amount: Number(form.amount) });
    setForm({ ...form, amount: "" });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/budgets/${id}`);
    load();
  };

  return (
    <section>
      <PageHeader title="Budget" description="Set monthly budgets and receive alerts when spending gets high." />
      <form onSubmit={submit} className="mb-5 rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-4">
          <input value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Budget amount" type="number" required />
          <input value={form.budgetType} onChange={(event) => setForm({ ...form, budgetType: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Budget type" required />
          <input value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
          <input value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" type="date" required />
        </div>
        <button className="mt-4 rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Save Budget</button>
      </form>
      <DataTable
        columns={[
          { key: "budgetType", label: "Type" },
          { key: "amount", label: "Amount" },
          { key: "startDate", label: "Start" },
          { key: "endDate", label: "End" }
        ]}
        rows={budgets}
        onDelete={remove}
      />
    </section>
  );
}
