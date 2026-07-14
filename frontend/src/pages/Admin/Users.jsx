import { useEffect, useState } from "react";
import { Eye, Plus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import PageHeader from "../../components/PageHeader";
import api from "../../services/api";

const emptyForm = { name: "", email: "", password: "", role: "ROLE_USER" };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

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
  }

  async function changeRole(id, role) {
    await api.put(`/admin/users/${id}/role`, { role: role === "ROLE_ADMIN" ? "ROLE_USER" : "ROLE_ADMIN" });
    loadUsers();
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/admin/users/${id}`);
    loadUsers();
  }

  return (
    <section>
      <PageHeader
        title="Users"
        description="Create users, change roles, and inspect user finance workspaces."
        actions={<button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={16} /> Add User</button>}
      />

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "role", label: "Role", render: (user) => <RoleBadge user={user} /> }
        ]}
        rows={users}
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

      {showAdd && (
        <Modal title="Add User" onClose={() => setShowAdd(false)}>
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
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${user.role === "ROLE_ADMIN" ? "bg-sky-500/10 text-sky-300" : "bg-violet-500/10 text-violet-300"}`}>
      {user.role.replace("ROLE_", "")}
    </span>
  );
}
