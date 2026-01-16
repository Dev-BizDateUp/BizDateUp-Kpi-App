import React from "react";

const DataTable = ({
  loading = false,
  data = [],
  columns = [],
  emptyText = "No data found",
  editingRowId = null,
  onAchievedChange,
}) => {
  if (loading) return <p className="text-center py-6">Loading…</p>;
  if (!data.length)
    return <p className="text-center py-6 text-gray-500">{emptyText}</p>;

  // ✅ total target calculation
  const totalTarget = data.reduce(
    (sum, row) => sum + Number(row.target || 0),
    0
  );

  // ✅ total achieved calculation
  const totalAchieved = data.reduce(
    (sum, row) => sum + Number(row.achieved || 0),
    0
  );

  return (
    <div className="overflow-x-auto w-full rounded-2xl shadow-lg">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-[#2b2d5b] text-white">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border p-2 text-left">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            const isRowEditing = editingRowId === row.id;
            return (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key} className="border p-2">
                    {col.render ? (
                      col.render(row, isRowEditing)
                    ) : col.key === "achieved" ? (
                      <input
                        type="number"
                        value={row.achieved}
                        disabled={!isRowEditing}
                        onChange={(e) =>
                          onAchievedChange(row.id, e.target.value)
                        }
                        className={`border p-1 rounded w-24 ${
                          isRowEditing
                            ? "bg-white border-blue-500"
                            : "bg-transparent border-none cursor-default"
                        }`}
                      />
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>

        {/* ✅ footer row showing total */}
        <tfoot className="bg-gray-100 font-semibold">
          <tr>
            {columns.map((col) => (
              <td key={col.key} className="border p-2">
                {col.key === "target" ? totalTarget : ""}
                {col.key === "date" ? "Total" : ""}
                {col.key === "achieved" ? totalAchieved : ""}
              </td>
             
              
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DataTable;
