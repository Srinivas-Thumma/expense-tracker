import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import api from "../../services/api";

const emptyForm = { name: "", type: "EXPENSE" };

export default function MasterCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const response = await api.get("/categories");
    setCategories(response.data);
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
    setForm({ name: row.name, type: row.type });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (editing?.mode === "edit") {
      await api.put(`/categories/${editing.id}`, form);
    } else {
      await api.post("/categories", form);
    }
    setEditing(null);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <section>
      <PageHeader
        title="Master Categories"
        description="Admin-owned income and expense categories used by every user."
        actions={<button onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16} /> Add Category</button>}
      />
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "type", label: "Type" }
        ]}
        rows={categories}
        onEdit={openEdit}
        onDelete={remove}
      />
      {editing && (
        <Modal title={editing.mode === "edit" ? "Edit Category" : "Add Category"} onClose={() => setEditing(null)}>
          <form onSubmit={submit} className="grid gap-4">
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Category name" required />
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2">
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
            <button className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white">Save Category</button>
          </form>
        </Modal>
      )}
    </section>
  );
}

