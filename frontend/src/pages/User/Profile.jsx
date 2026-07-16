import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/PageHeader.jsx";
import api, { API_ORIGIN } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Profile() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const { logout, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", phone: "", email: "", profilePicture: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/profile").then((response) => setForm(response.data));
  }, []);

  async function uploadProfilePicture(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const response = await api.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(response.data);
      updateUser({ name: response.data.name, profilePicture: response.data.profilePicture });
    } catch (err) {
      console.error(err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  const submit = async (event) => {
    event.preventDefault();
    const response = await api.put("/profile", form);
    setForm(response.data);
    updateUser({ name: response.data.name, profilePicture: response.data.profilePicture });
    setSaved(true);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const profileSrc = form.profilePicture
    ? `${API_ORIGIN}${form.profilePicture}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || "User")}&background=202024&color=eaeaea`;

  return (
    <section>
      <PageHeader title="Profile" description="Update user details and profile picture." />

      <form onSubmit={submit} className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-4 border-b border-slate-200 pb-5">
          <img
            src={profileSrc}
            alt="Profile"
            className="h-24 w-24 rounded-full border-2 border-teal-300/35 object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{form.name || "User profile"}</h3>
            <p className="text-sm text-slate-500">{form.email}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <ProfileRow label="Name">
            <input value={form.name || ""} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Name" />
          </ProfileRow>

          <ProfileRow label="Email">
            <input value={form.email || ""} className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2" placeholder="Email" type="email" disabled />
          </ProfileRow>

          <ProfileRow label="Phone">
            <input value={form.phone || ""} onChange={(event) => setForm({ ...form, phone: event.target.value })} className="w-full rounded-md border border-slate-300 px-3 py-2" placeholder="Phone" />
          </ProfileRow>

          <ProfileRow label="Picture">
            <input type="file" accept="image/*" onChange={uploadProfilePicture} />
            {uploading && <p className="mt-2 text-sm text-slate-500">Uploading image...</p>}
          </ProfileRow>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button className="rounded-md bg-emerald-600 px-4 py-2 font-semibold text-white">Update Profile</button>
          {saved && <p className="text-sm font-medium text-emerald-700">Profile saved.</p>}
        </div>
      </form>

      <div className="mx-auto mt-4 max-w-3xl rounded-lg border border-red-400/30 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-950">Account session</h3>
            <p className="text-sm text-slate-500">Sign out of Expenza on this device.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-red-300 bg-[#ff1f1f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#e60000]"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

function ProfileRow({ label, children }) {
  return (
    <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[120px_1fr] sm:items-center">
      <label className="text-sm font-semibold text-slate-500">{label}</label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
