import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import api from "../services/api.js";

export default function Reports() {
  const [report, setReport] = useState({ summary: { income: 0, expenses: 0, balance: 0 } });
  const now = new Date();

  useEffect(() => {
    api.get(`/reports/monthly?year=${now.getFullYear()}&month=${now.getMonth() + 1}`).then((response) => setReport(response.data));
  }, []);

  return (
    <section>
      <PageHeader title="Reports" description="View monthly, category, and trend reports." />
      <div className="grid gap-4 md:grid-cols-3">
        <ReportCard title="Monthly Income" value={report.summary.income} />
        <ReportCard title="Monthly Expenses" value={report.summary.expenses} />
        <ReportCard title="Monthly Balance" value={report.summary.balance} />
      </div>
    </section>
  );
}

function ReportCard({ title, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-2xl font-bold">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value || 0))}</p>
    </div>
  );
}
