import React from "react";
import Card from "../Global_Components/Card";
import { useNavigate , useParams } from "react-router-dom";

const WEEKS = [
  { label: "Week 1", value: 1 },
  { label: "Week 2", value: 2 },
  { label: "Week 3", value: 3 },
  { label: "Week 4", value: 4 },
  { label: "Week 5", value: 5 },
];

const Kpi_review_weeks = () => {
  const { empId, year, month } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">
        KPI Review – {month}/{year}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {WEEKS.map((week) => (
          <Card
            key={week.value}
            title={week.label}
            onClick={() =>
              navigate(
                `/kpireview/${empId}/${year}/${month}/${week.value}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default Kpi_review_weeks;
