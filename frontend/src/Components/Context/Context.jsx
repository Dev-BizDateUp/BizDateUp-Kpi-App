import React, { createContext, useContext, useEffect, useState } from "react";
import { getDepartments, getDesignation, getDesignationByEmploeeName, getEmployees } from "../../Api/Endpoints/endpoints";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [dept, setdept] = useState([]);
  const [designation, setdesignation] = useState([]);
  const [departments, setdepartments] = useState([]);
  const [employees, setemployees] = useState([]);

  const getDepartmentss = async () => {
    try {
      const response = await getDepartments();
      if (response) {
        setdept(response);
      }
    } catch (e) {
      return e;
    }
  };

  const getDesignations = async () => {
    try {
      const response = await getDesignation();
      if (response) {
        setdesignation(response);
      }
    } catch (e) {
      return e;
    }
  };

  const getDesignationsByEmployee = async () => {
    try {
      const response = await getDesignationByEmploeeName();
      if (response) {
        setdepartments(response.data);
      }
    } catch (e) {
      return e;
    }
  };

  const getEmployeesContext = async () => {
    try {
      const response = await getEmployees();
      if (response) {
        setemployees(response.employees);
      }
    } catch (e) {
      return e;
    }
  };
  
  useEffect(() => {
    getDepartmentss();
    getDesignations();
    getDesignationsByEmployee();
    getEmployeesContext();
  }, []);
  
  return (
    <AppContext.Provider value={{ dept,setdept, designation,setdesignation, departments,setdepartments, employees,setemployees }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);
