import React, { useState } from "react";
import Card from "../Global_Components/Card";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getMonthName } from "../../utils";
// Helper to format date ranges
// Logic to map API weeks to cards
// e.g. "2024-01-01_2024-01-07" -> "Week 1 (01-07)"

const Kpi_review_weeks = () => {
  const { empId, year, month } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const apiData = location.state?.apiData?.data || [];
  // console.log(location);
  
  // If apiData is empty or not passed, you might want to handle that (e.g. fetch again or show empty)
  // But for now we assume it was passed from previous screen.
  const [filter, setFilter] = useState("ALL");

  const filteredData = apiData.filter((item) => {
    if (filter === "ALL") return true;
    return item.status === filter;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">
          KPI Review - {getMonthName(month)}/{year}
        </h2>
        
        <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filter === "ALL"
                ? "bg-white text-[#687FE5] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filter === "PENDING"
                ? "bg-white text-[#687FE5] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("APPROVED")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              filter === "APPROVED"
                ? "bg-white text-[#687FE5] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filteredData.length > 0 ? (
          filteredData.map((weekData, index) => {
            const weekLabel = ` (${weekData.week_start.slice(5)} to ${weekData.week_end.slice(5)})`;
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
          <div className="col-span-full py-12 text-center">
            <p className="text-gray-500 italic">No {filter !== "ALL" ? filter.toLowerCase() : ""} KPI data found for this month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kpi_review_weeks;
