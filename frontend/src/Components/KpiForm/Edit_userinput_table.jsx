import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetterContext } from "../Context/NewContext";
import { getkpidata, editKpiEntry } from "../../Api/Endpoints/endpoints";
import DataTable from "../Global_Components/DataTable";
import ErrorBox from "../ErrorBox";

const Edit_userinput_table = () => {
  const { me } = useContext(GetterContext);
  const { year, month } = useParams();

  const columns = [
    { key: "kpi", header: "KPI Name" },
    { key: "achieved", header: "Achieved" },
    { key: "action", header: "Action" },
  ];

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingRowId, setEditingRowId] = useState(null);

  useEffect(() => {
    if (!me?.id) return;

    setLoading(true);

    getkpidata({ employee_id: me.id })
      .then((res) => {
        const apiData = res?.data || [];

        const filtered = apiData.filter((row) => {
          if (!row.entry_date) return false;

          const d = new Date(row.entry_date);
          return (
            d.getFullYear() === Number(year) &&
            d.getMonth() + 1 === Number(month)
          );
        });

        setData(
          filtered.map((row) => ({
            id: row.id,
            kpi: row.kpis?.title ?? "-",
            achieved: Number(row.value ?? 0),
          }))
        );
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [me?.id, year, month]);

  const handleAchievedChange = (id, value) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, achieved: Number(value) }
          : row
      )
    );
  };

  const handleSubmitRow = async (id) => {   
    try {
      const row = data.find((r) => r.id === id);

      await editKpiEntry(id, {
        value: row.achieved,
      });

      setEditingRowId(null); 
    } catch (err) {
      console.error("Update failed", err);
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
      <h2 className="text-xl font-semibold mb-4">
        KPI Review – {month}/{year}
      </h2>

      {!loading && tableData.length === 0 ? (
        <ErrorBox>No KPI data found for this month</ErrorBox>
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          loading={loading}
          editingRowId={editingRowId}
          onAchievedChange={handleAchievedChange}
        />
      )}
    </div>
  );
};

export default Edit_userinput_table;
