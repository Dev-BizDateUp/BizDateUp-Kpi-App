import React, { useState } from "react";

const Edit_userinput_form = () => {
  const [kpis, setKpis] = useState([
    { id: 1, name: "Calls Made", value: 25,Date:25-10-2025 },
    { id: 2, name: "Leads Closed", value: 10 ,Date:25-10-2025},
  ]);

  const handleChange = (id, newValue) => {
    setKpis((prev) =>
      prev.map((kpi) =>
        kpi.id === id ? { ...kpi, value: newValue } : kpi
      )
    );
  };

  const handleSubmit = () => {
    const payload = {
      entry_date: "2026-01-06",
      kpis: kpis.map((kpi) => ({
        kpi_id: kpi.id,
        value: Number(kpi.value),
      })),
    };

    // console.log("PATCH payload →", payload);
 
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Edit KPI Values</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">KPI Name</th>
            <th className="border p-2 text-left">Value</th>
            <th className="border p-2 text-left">Date</th>
          </tr>
        </thead>

        <tbody>
          {kpis.map((kpi) => (
            <tr key={kpi.id}>
              <td className="border p-2">{kpi.name}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={kpi.value}
                  onChange={(e) =>
                    handleChange(kpi.id, e.target.value)
                  }
                  className="border rounded p-1 w-full"
                />
              </td>
                <td className="border p-2">{kpi.Date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-[#312F54] text-white px-6 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default Edit_userinput_form;
