import React, { useState } from "react";
import DataTable from "../Global_Components/DataTable";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import { patchkpidata } from "../../Api/Endpoints/endpoints";

const Kpi_review_week_table = () => {
  const { week, year, month } = useParams();
  const location = useLocation();
  const weekData = location.state?.weekData || {};
  const entries = weekData.entries || [];

  const columns = [
    { key: "date", header: "Date" },
    { key: "kpi", header: "KPI Name" },
    { key: "achieved", header: "Achieved" },
    { key: "target", header: "Target" },
    { key: "action", header: "Action" },
  ];

  const [data, setData] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);

  React.useEffect(() => {
    if (entries.length > 0) {
      // console.log("Entries Data:", entries);
      const formattedData = entries.map((entry, index) => {
        // console.log(`Processing Row ${index}:`, entry);
        let rawKpiId = entry.kpis?.id;
        // console.log(` - check 1 (kpis.id):`, rawKpiId);
        
        if (!rawKpiId && Array.isArray(entry.kpis) && entry.kpis.length > 0) {
           rawKpiId = entry.kpis[0].kpi_id || entry.kpis[0].id;
           //  console.log(` - check 2 (kpis[0].id/kpi_id):`, rawKpiId);
        }
        
        if (!rawKpiId) {
            rawKpiId = entry.kpis?.kpi_id;
            // console.log(` - check 3 (kpis.kpi_id):`, rawKpiId);
        }

         if (!rawKpiId) {
            // Last ditch effort: iterate keys?
            // console.warn(` - FAILED TO FIND ID for row ${index}`);
        }

        return {
          id: index, 
          kpi_id: Number(rawKpiId), 
          entry_date: entry.entry_date,
          date: new Date(entry.entry_date).toLocaleDateString(),
          kpi: (Array.isArray(entry.kpis) ? entry.kpis[0]?.title : entry.kpis?.title) || "-",
          target: (Array.isArray(entry.kpis) ? entry.kpis[0]?.target : entry.kpis?.target) || "-",
          achieved: entry.value !== undefined ? entry.value : ((Array.isArray(entry.kpis) ? entry.kpis[0]?.value : 0) ?? 0),
        };
      });
      setData(formattedData);
    }
  }, [entries]);

  const handleAchievedChange = (id, value) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, achieved: Number(value) } : row
      )
    );
  };

  const handleSubmitRow = async (id) => {
    try {
      const row = data.find((r) => r.id === id);

      const payload = {
        entry_date: new Date(row.entry_date).toISOString().split("T")[0],
        kpis: [
          {
            kpi_id: row.kpi_id,
            value: row.achieved,
          },
        ],
      };

      // console.log("PAYLOAD TO SEND:", payload); 

      await patchkpidata(payload);
      toast.success("KPI Updated Successfully");
      setEditingRowId(null);
    } catch (err) {
      console.error("Submit failed", err);
      toast.error("Failed to update KPI");
    }
  };

  const tableData = data.map((row) => ({
    ...row,
    action:
      editingRowId === row.id ? (
        <button
          className="bg-[#7e7676] text-white px-3 py-1 rounded"
          onClick={() => handleSubmitRow(row.id)}
        >
          Submit
        </button>
      ) : (
        <button
          className="bg-[#687FE5] text-white px-6 py-1 rounded"
          onClick={() => setEditingRowId(row.id)}
        >
          Edit
        </button>
      ),
  }));

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <h2 className="text-xl font-semibold mb-4">
        Week {week} KPI Review ({month}/{year})
      </h2>
<div className="py-2">
  <button 
className="bg-[#687FE5] text-white px-6 py-1 rounded">
  submit
</button>
</div>
      <DataTable
        columns={columns}
        data={tableData}
        loading={false}
        emptyText="No KPI data"
        editingRowId={editingRowId}
        onAchievedChange={handleAchievedChange}
      />
    </div>
  );
};

export default Kpi_review_week_table;
