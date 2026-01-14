import React from "react";
import Card from "../Global_Components/Card";
import { useNavigate, useParams, useLocation } from "react-router-dom";
// Helper to format date ranges
// Logic to map API weeks to cards
// e.g. "2024-01-01_2024-01-07" -> "Week 1 (01-07)"

const Kpi_review_weeks = () => {
  const { empId, year, month } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const apiData = location.state?.apiData?.data || [];
  console.log(location);
  
  // If apiData is empty or not passed, you might want to handle that (e.g. fetch again or show empty)
  // But for now we assume it was passed from previous screen.

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">
        KPI Review – {month}/{year}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {apiData.length > 0 ? (
          apiData.map((weekData, index) => {
            const weekLabel = `Week ${index + 1} (${weekData.week_start.slice(5)} to ${weekData.week_end.slice(5)})`;
            const isApproved = weekData.status === "APPROVED";
            
            return (
              <Card
                key={index}
                title={weekLabel}
                // Determine styling based on status if needed
                className={`border-l-4 ${isApproved ? 'border-green-500' : 'border-yellow-500'}`}
                // status={weekData.status}
                onClick={() =>
                  navigate(
                    `/kpireview/${empId}/${year}/${month}/${index + 1}`,
                    { state: { weekData: weekData } }
                  )
                }
              />
            );
          })
        ) : (
          <p>No KPI data found for this month.</p>
        )}
      </div>
    </div>
  );
};

export default Kpi_review_weeks;
