import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  Receipt,
  Target,
  TrendingUp,
  UserCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_ORIGIN } from "../../services/api.js";

const navItems = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Income", "/income", TrendingUp],
  ["Expenses", "/expenses", Receipt],
  ["Budget", "/budget", Target],
  ["Reports", "/reports", PieChart],
  ["Profile", "/profile", UserCircle]
];

function avatarUrl(user) {
  if (user?.profilePicture) return `${API_ORIGIN}${user.profilePicture}`;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=202024&color=eaeaea`;
}

export default function MainLayout() {
  const { user } = useAuth();

  if (user?.role === "ROLE_ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0E0E10]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] border-r border-slate-800 bg-[#141416] text-white shadow-2xl lg:block">
        <div className="flex flex-col items-center border-b border-white/10 px-5 py-7 text-center">
          <img src={avatarUrl(user)} alt="" className="h-20 w-20 rounded-full border-2 border-teal-300/40 object-cover shadow-lg shadow-black/40" />
          <h1 className="mt-3 max-w-full truncate text-sm font-bold tracking-wide text-slate-100">{user?.name || "User"}</h1>
          <p className="mt-1 text-xs font-medium text-slate-400">Personal finance</p>
        </div>

        <nav className="grid gap-2 p-4">
          {navItems.map(([label, path, Icon]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-teal-500/15 text-teal-200 ring-1 ring-teal-300/20" : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Link to="/dashboard" className="flex items-center justify-center gap-2 rounded-lg border border-teal-300/25 bg-teal-300/10 px-3 py-3 text-lg font-black tracking-wide text-teal-100 hover:bg-teal-300/15">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-300 text-sm font-black text-slate-950 shadow-[0_0_16px_rgba(98,208,195,0.45)]">E</span>
            Expenza
          </Link>
        </div>
      </aside>

      <div className="lg:pl-[240px]">
        <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-1">
            {navItems.map(([label, path, Icon]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? "bg-teal-500/20 text-teal-200" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
