import { Edit3, Trash2 } from "lucide-react";

export default function DataTable({ columns, rows, emptyText = "No records yet.", onDelete, onEdit, actions }) {
  if (!rows.length) {
    return <p className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm font-medium text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-bold">{column.label}</th>
            ))}
            {(onDelete || onEdit || actions) && <th className="px-4 py-3 font-bold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className={`border-t border-slate-100 transition hover:bg-slate-50 ${index % 2 === 0 ? "bg-[#18181A]" : "bg-[#1C1C1E]"}`}>
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 font-medium text-slate-700">{column.render ? column.render(row) : row[column.key]}</td>
              ))}
              {(onDelete || onEdit || actions) && (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {onEdit && (
                      <button title="Edit" onClick={() => onEdit(row)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-sky-400/30 bg-sky-500/15 text-sky-300 hover:bg-sky-500/25">
                        <Edit3 size={15} />
                      </button>
                    )}
                    {actions?.(row)}
                    {onDelete && (
                      <button title="Delete" onClick={() => onDelete(row.id)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-700 hover:bg-red-50">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
