import React, { useState } from "react";
import DataTable from "../Global_Components/DataTable";

const Kpi_review_week_table = () => {
  const columns = [
    { key: "kpi", header: "KPI Name" },
    { key: "target", header: "Target" },
    { key: "achieved", header: "Achieved" },
  ];

  const [data, setData] = useState([
    {
      id: 1,
      kpi: "Sales Calls",
      target: 50,
      achieved: 45,
    },
    {
      id: 2,
      kpi: "Client Meetings",
      target: 10,
      achieved: 12,
    },
  ]);

  const [isEditMode, setIsEditMode] = useState(false);

  const handleAchievedChange=(id,value)=>{
    setData((prev)=>{
      prev.map((row)=>{
        row.id=== id ?{...row,achieved:Number(value)}
        :row
      })
    })
  }



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
        Week 1 KPI Review
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
