import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  FolderTree,
  LayoutDashboard,
  Settings,
  UserCircle,
  Users
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { API_ORIGIN } from "../../services/api";

const navItems = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Users", "/admin/users", Users],
  ["Master Categories", "/admin/categories", FolderTree],
  ["Reports", "/admin/reports", BarChart3],
  ["Settings", "/admin/settings", Settings],
  ["Profile", "/admin/profile", UserCircle]
];

function avatarUrl(user) {
  if (user?.profilePicture) return `${API_ORIGIN}${user.profilePicture}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=202024&color=eaeaea`;
}

export default function AdminLayout() {
  const { user } = useAuth();

  if (user?.role !== "ROLE_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] border-r border-slate-800 bg-[#141416] text-white shadow-2xl lg:block">
        <div className="flex flex-col items-center border-b border-white/10 px-5 py-7 text-center">
          <img src={avatarUrl(user)} alt="" className="h-20 w-20 rounded-full border-2 border-sky-300/40 object-cover shadow-lg shadow-black/40" />
          <h2 className="mt-3 max-w-full truncate text-sm font-bold tracking-wide text-slate-100">{user?.name || "Admin"}</h2>
          <p className="mt-1 text-sm font-bold tracking-wide text-sky-200 drop-shadow-[0_0_6px_rgba(125,211,252,0.35)]">Admin panel</p>
        </div>

        <nav className="grid gap-2 p-4">
          {navItems.map(([title, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-300/20" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {title}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link to="/admin" className="flex items-center justify-center gap-2 rounded-lg border border-sky-300/25 bg-sky-300/10 px-3 py-3 text-lg font-black tracking-wide text-sky-100 hover:bg-sky-300/15">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-sky-300 text-sm font-black text-slate-950 shadow-[0_0_16px_rgba(125,211,252,0.45)]">E</span>
            Expenza
          </Link>
        </div>
      </aside>

      <main className="lg:ml-[240px]">
        <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map(([title, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                end={path === "/admin"}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-sky-500/20 text-sky-200" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={16} />
                {title}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
