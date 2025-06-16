import api from "../api";
// Get Employee Details Api

export async function getKpiVals_Employee(emp_id) {
  try {
    const res = await api.get(`/api/kpi/value/emp/${encodeURIComponent(emp_id)}/row`);
    return res;
  } catch (ex) {
    console.log('Could not fetch kpi values for employee ' + emp_id);
    console.log(ex)
    throw new Error(ex);
  }
}

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

export async function getEmployeesUnderDesg(desgID) {
  try {
    const response = await api.get(`/api/designation/id/${encodeURIComponent(desgID)}/emps`);
    return response.data;
  } catch (ex) {
    console.log("Could not get employees under that designation!");
    throw new Error(ex)
  }
}
export const deleteForceKPI = async (id) => {
  try {
    const res = await api.delete(`/api/kpi/id/${encodeURIComponent(id)}/force`)
    return res;
  }
  catch (ex) {
    console.log(`Could not delete kpi: ${ex}`);
  }
}

export const getKPIID = async (id) => {
  try {
    const res = await api.get(`/api/kpi/id/${encodeURIComponent(id)}`)
    return res;
  }
  catch (ex) {
    console.log(`Could not delete kpi: ${ex}`);
  }
}
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
      id: null,
      success: false,
      error: error.response.data.error
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
export const getDesignationInfo = async (id) => {
  try {
    const response = await api.get("/api/designation/id/" + encodeURIComponent(id));

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

export async function getKPIsForEmployee(emp_id) {
  try {
    const response = await api.get(`/api/kpi/emp/${encodeURIComponent(emp_id)}`)
    return response;
  } catch (exc) {
    console.log(error);
    const message = "Something went wrong while getting kpis for an employee";
    throw new Error(message);
  }
}

export async function getKPIsForDesg(desg_id) {
  try {
    const response = await api.get(`/api/kpi/desg/${encodeURIComponent(desg_id)}`);
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
    title,
    description,
    frequency_id,
    target,
    yellow_threshold,
    green_threshold,
    designation_id,
    value_type
  }
) {
  try {
    const response = await api.post("/api/kpi", {
      title,
      description,
      frequency_id,
      target,
      yellow_threshold,
      green_threshold,
      designation_id,
      value_type
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

export async function editKPI(
  {
    id,
    title,
    description,
    frequency_id,
    target,
    yellow_threshold,
    green_threshold,
    designation_id
  }
) {
  try {
    const response = await api.patch("/api/kpi/id/" + encodeURIComponent(id), {
      title,
      description,
      frequency_id,
      target,
      yellow_threshold,
      green_threshold,
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

// Fetch Designation With Employees Name 
export const getDesignationByEmploeeName = async () => {
  try {
    const response = await api.get("/api/get/getdesignationbyid");
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(error);

    const message = "Something went wrong while fetching departments";
    throw new Error(message);
  }
};