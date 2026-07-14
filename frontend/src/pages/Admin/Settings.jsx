import { useState } from "react";
import { Bell, LockKeyhole, ShieldAlert, SlidersHorizontal } from "lucide-react";
import PageHeader from "../../components/PageHeader";

export default function Settings() {
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [auditAlerts, setAuditAlerts] = useState(true);

  return (
    <section>
      <PageHeader title="Expense Tracker" description="System preferences, access controls, and operational safeguards." />

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">Access Control</h3>
              <p className="text-sm text-slate-500">Public signup and account entry rules.</p>
            </div>
          </div>

          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-800">Allow New User Registration (Public Signup)</p>
              <p className="text-sm text-slate-500">When enabled, people can register from the login page.</p>
            </div>
            <button
              type="button"
              onClick={() => setAllowRegistration((value) => !value)}
              className={`relative h-7 w-12 rounded-full transition ${allowRegistration ? "bg-emerald-600" : "bg-slate-300"}`}
              aria-pressed={allowRegistration}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${allowRegistration ? "left-6" : "left-1"}`} />
            </button>
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-700">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">Notification Policy</h3>
              <p className="text-sm text-slate-500">Mock operational settings for admin review.</p>
            </div>
          </div>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
            <div>
              <p className="font-medium text-slate-800">Send Security Audit Alerts</p>
              <p className="text-sm text-slate-500">Notify admins when roles or user access change.</p>
            </div>
            <button
              type="button"
              onClick={() => setAuditAlerts((value) => !value)}
              className={`relative h-7 w-12 rounded-full transition ${auditAlerts ? "bg-blue-600" : "bg-slate-300"}`}
              aria-pressed={auditAlerts}
            >
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${auditAlerts ? "left-6" : "left-1"}`} />
            </button>
          </label>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700">
              <SlidersHorizontal size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-950">System Defaults</h3>
              <p className="text-sm text-slate-500">Default currency INR, monthly reporting window, and email budget alerts enabled.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {["Currency: INR", "Reports: Monthly", "Budget Alerts: Enabled"].map((item) => (
              <div key={item} className="rounded-md bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-red-100 text-red-700">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-red-950">Danger Zone</h3>
                <p className="text-sm text-red-700">High-impact maintenance actions require extra review.</p>
              </div>
            </div>
            <button className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Purge Inactive Users
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
