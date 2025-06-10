import api from "../api";
// Get Employee Details Api
export const getEmployees = async () => {
  try {
    const response = await api.get("/api/get/getemployee");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    const message = "Something went wrong while fetching employees";
    throw new Error(message);
  }
};
export const getDepartmentDetails = async (name) => {
  try {
    const response = await api.get("/api/department/name/" + name);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    const message = "Something went wrong while fetching employees";
    throw new Error(message);
  }
};
// Post Employee Details Api
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/api/createemployee", employeeData);
    console.log(response);

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else if (response.status == 409) {
      return new Error(`An employee with that ${response.data.conflict} already exists: ${response.data.error}`)
    } else {
      return new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(`Could not create employee : ${JSON.stringify(error.response.data)}`)
    const message = "Something went wrong while creating an employee: " + error.response.data.error;
    // throw new Error({message:error.response.data});
    return {
      id:null,
      success:false,
      error:error.response.data.error
    };
  }
};
// Update Employee Status
export const updateEmployeeStatus = async ({ id, status }) => {
  try {
    const response = await api.patch(`/api/patch/changeemployeestatus`, { status, id });
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
    const response = await api.post("/api/createdepartments", departments);

    if (response.status === 201 || response.status === 200) {
      console.log(response.data);
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
    const response = await api.get("/api/get/getdepartments");

    if (response.status === 200) {
      return response.data.departments;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);

    const message = "Something went wrong while fetching departments";
    throw new Error(message);
  }
};

// Create Designation 
export const createDesignation = async (designation) => {
  try {
    const response = await api.post("/api/post/createdesignation", designation);
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    // console.log(error);
    // const message = "Something went wrong while creating designation";
    throw new Error(error.response.data.error);
  }
};
export async function getKPIFreq() {
  try {
    const response = await api.get("/api/kpi/freq");
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);
    const message = "Something went wrong while getting kpi frequecies";
    throw new Error(message);
  }
}
export async function createKPI(
  {
    id,
    title,
    description,
    frequency_id,
    target,
    threshold_red_min,
    threshold_red_max,
    threshold_amber_min,
    threshold_amber_max,
    threshold_green_min,
    threshold_green_max,
    designation_id
  }
) {
  try {
    const response = await api.post("/api/kpi", {
      id,
      title,
      description,
      frequency_id,
      target,
      threshold_red_min,
      threshold_red_max,
      threshold_amber_min,
      threshold_amber_max,
      threshold_green_min,
      threshold_green_max,
      designation_id
    });
    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (ex) {
    console.log(error);
    const message = "Something went wrong while creating kpi";
    throw new Error(message);
  }
}

// Fetch Designation
export const getDesignation = async () => {
  try {
    const response = await api.get("/api/get/getdesignation");
    if (response.status === 200) {
      return response.data.designation;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);

    const message = "Something went wrong while fetching departments";
    throw new Error(message);
  }
};

