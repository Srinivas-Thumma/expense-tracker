import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

export default function Profile() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", profilePicture: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/profile").then((response) => setForm(response.data));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const response = await api.put("/profile", form);
    setForm(response.data);
    setSaved(true);
  };

  return (
    <section>
      <PageHeader title="Profile" description="Update user details and profile picture." />
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <input value={form.name || ""} onChange={(event) => setForm({ ...form, name: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Name" />
          <input value={form.phone || ""} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Phone" />
          <input value={form.email || ""} className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2" placeholder="Email" type="email" disabled />
          <input value={form.profilePicture || ""} onChange={(event) => setForm({ ...form, profilePicture: event.target.value })} className="rounded-md border border-slate-300 px-3 py-2" placeholder="Profile image URL" />
        </div>
        <button className="mt-4 rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Update Profile</button>
        {saved && <p className="mt-3 text-sm font-medium text-emerald-700">Profile saved.</p>}
      </form>
    </section>
  );
}
