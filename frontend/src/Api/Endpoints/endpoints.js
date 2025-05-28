import api from "../api";
// Get Employee Details Api
export const getEmployees = async () => {
  try {
    const response = await api.get("/employees");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    const message ="Something went wrong while fetching employees";
    throw new Error(message);
  }
};
// Post Employee Details Api
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/employees", employeeData);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    const message = "Something went wrong while creating an employee";
    throw new Error(message);
  }
};
// Update Employee Status
export const updateEmployeeStatus = async (employeestatus) => {
  try {
    
    const response = await api.put(`/employees/${employeestatus.id}`,  employeestatus.status);
    
    if (response.status === 201 || response.status === 200) {
   return console.log("Employee Updated")
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    
    const message = "Something went wrong while updating an employee";
    throw new Error(message);
  }
};