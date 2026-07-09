export default function DataTable({ columns, rows, emptyText = "No records yet.", onDelete }) {
  if (!rows.length) {
    return <p className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">{column.label}</th>
            ))}
            {onDelete && <th className="px-4 py-3 font-semibold">Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">{column.render ? column.render(row) : row[column.key]}</td>
              ))}
              {onDelete && (
                <td className="px-4 py-3">
                  <button onClick={() => onDelete(row.id)} className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
