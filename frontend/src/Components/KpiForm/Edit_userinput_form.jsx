import React, { useContext, useEffect, useState } from "react";
import { CURRENT_YEAR, YEARS } from "../ManagerReview/QauterlyForm";
import { MONTHS } from "../ManagerReview/ReviewForm";
import { GetterContext } from "../Context/NewContext";
import { getkpidata } from "../../Api/Endpoints/endpoints";
import DataTable from "../Global_Components/DataTable";
import Card from "../Global_Components/Card";
import { useNavigate } from "react-router-dom";

const Edit_userinput_form = () => {
  const { me } = useContext(GetterContext);
const navigate = useNavigate();

  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!me?.id) return;

    setLoading(true);
    getkpidata({ employee_id: me.id })
      .then((res) => setKpis(res?.data || []))
      .catch(() => setKpis([]))
      .finally(() => setLoading(false));
  }, [me?.id]);

  return (
     <div className="p-6">
     <div className="flex flex-col items-end capitalize">
       <label className="block text-sm font-semibold mb-2"> Select year to review KPI for Employee</label>

      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="border py-2 px-15 rounded mb-4"
      >
        {YEARS.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
     </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {MONTHS.map((month) => (
         <Card
  key={month.value}
  title={month.label}
  onClick={() =>
    navigate(`/kpi/edit/${selectedYear}/${month.value}`)
  }
/>

        ))}
      </div>
    </div>
  );
};

export default Edit_userinput_form;
