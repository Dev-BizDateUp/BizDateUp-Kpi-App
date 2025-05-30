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
export const updateEmployeeStatus = async ({id, status}) => {
  try {
    const response = await api.patch(`/employees/${id}`, {status});
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

// Create Departments
export const createDepartments = async (departments) => {
  try {
    const response = await api.post("/departments", departments);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    const message = "Something went wrong while creating an department";
    throw new Error(message);
  }
};

// Fetch Departments
export const getDepartments = async () => {
  try {
    const response = await api.get("/departments");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    
    const message ="Something went wrong while fetching departments";
    throw new Error(message);
  }
};

// Create Designation 
export const createDesignation = async (designation) => {
  try {
    const response = await api.post("/designation", designation);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
      const message = "Something went wrong while creating designation";
    throw new Error(message);
  }
};

// Fetch Designation
export const getDesignation = async () => {
  try {
    const response = await api.get("/designation");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    
    const message ="Something went wrong while fetching departments";
    throw new Error(message);
  }
};

