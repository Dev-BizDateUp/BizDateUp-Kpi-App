import React, { useState } from "react";
import DataTable from "../Global_Components/DataTable";
import { useLocation, useParams } from "react-router-dom";

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
  ];

  const [data, setData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false); // Kept for future use

  React.useEffect(() => {
    if (entries.length > 0) {
      const formattedData = entries.map((entry, index) => ({
        id: index, // key for list
        date: new Date(entry.entry_date).toLocaleDateString(),
        kpi: entry.kpis?.title || "-",
        target: entry.kpis?.target || "-",
        achieved: entry.value,
      }));
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



  const handleSubmit = async () => {
    try {
      setIsEditMode(false);
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">
        Week {week} KPI Review ({month}/{year})
      </h2>

      <div className="flex gap-4 mb-4">
        {!isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="bg-[#687FE5] px-6 py-2 text-white rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 px-6 py-2 text-white rounded"
          >
            Submit
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={false}
        emptyText="No KPI data"
        isEditMode={isEditMode}
        onAchievedChange={handleAchievedChange}
      />
    </div>
  );
};

export default Kpi_review_week_table;
