import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../Global_Components/Card";
import { GetterContext } from "../Context/NewContext";
import { getEmployees } from "../../Api/Endpoints/endpoints";
// import Kpi_review_months from "./Kpi_review_months";
import { useParams } from 'react-router-dom';
const Kpi_review = () => {
  const navigate = useNavigate();
  
    
  const { me } = useContext(GetterContext);
  const [emps, setEmps] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await getEmployees();
      const filteredEmployees = res.employees.filter(
        emp => emp.id 
      );
      setEmps(filteredEmployees);
    })();
  }, [me.id]);

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-medium mb-6">
        Select Employee
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {emps.map(emp => (
          <Card
            key={emp.id}
            title={emp.name}
            subtitle={emp.designation}
          onClick={() => navigate(`/kpireview/${emp.id}`)}

          />
        ))}

       
      </div>
    </div>
  );
};

export default Kpi_review;
