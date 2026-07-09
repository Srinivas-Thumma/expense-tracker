import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, LogOut, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Income", "/income"],
  ["Expenses", "/expenses"],
  ["Categories", "/categories"],
  ["Budget", "/budget"],
  ["Reports", "/reports"],
  ["Profile", "/profile"]
];

export default function MainLayout() {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white">
              <Wallet size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold">Expense Tracker</h1>
              <p className="text-xs text-slate-500">Full stack finance app</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="mb-3 flex items-center gap-2 px-2 text-sm font-semibold text-slate-500">
            <BarChart3 size={16} />
            Menu
          </div>
          <nav className="grid gap-1">
            {navItems.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
