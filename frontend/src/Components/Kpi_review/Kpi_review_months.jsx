import React, { useState } from "react";
import Card from "../Global_Components/Card";
import { YEARS, CURRENT_YEAR } from "../ManagerReview/QauterlyForm";
import { MONTHS } from "../ManagerReview/ReviewForm";
import { useNavigate, useParams } from "react-router-dom";

const Kpi_review_months = () => {
  const { empId } = useParams();
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const navigate = useNavigate();

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
              navigate(
                `/kpireview/${empId}/${selectedYear}/${month.value}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Kpi_review_months;
