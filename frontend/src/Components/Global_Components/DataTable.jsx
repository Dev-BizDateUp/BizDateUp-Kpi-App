import React from "react";

const DataTable = ({
  loading = false,
  data = [],
  columns = [],
  emptyText = "No data found",
  isEditMode = false,
  onAchievedChange,
}) => {
  if (loading) {
    return <p className="text-center py-6">Loading…</p>;
  }

  if (!data.length) {
    return (
      <p className="text-center py-6 text-gray-500">
        {emptyText}
      </p>
    );
  }

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
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className="border p-2">
                  {col.key === "achieved" ? (
                    <input
                      type="number"
                      value={row.achieved}
                      disabled={!isEditMode}
                      onChange={(e) =>
                        onAchievedChange(row.id, e.target.value)
                      }
                      className={`border p-1 rounded w-24 ${
                        isEditMode
                          ? "bg-white"
                          : "bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
