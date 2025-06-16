import React, { createContext, useContext, useEffect, useState } from "react";
import { getDepartments, getDesignation, getDesignationByEmploeeName } from "../../Api/Endpoints/endpoints";
const AppContext = createContext();
export const AppProvider = ({ children }) => {
  const [dept, setdept] = useState([]);
  const [designation, setdesignation] = useState([]);
  const [departments, setdepartments] = useState([]);
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
  useEffect(() => {
    getDepartmentss();
    getDesignations();
    getDesignationsByEmployee();
  }, []);
  return (
    <AppContext.Provider value={{ dept, designation, departments }}>
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = () => useContext(AppContext);
