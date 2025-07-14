import axios from "axios";
import api from "../api";
// Get Employee Details Api
export async function getEmployee(emp_id) {
  try {
    const emp = await api.get(`/api/employee/id/${encodeURIComponent(emp_id)}`);
    return { result: emp }
  } catch (exc) {
    return { error: exc }
  }
}
export async function getEmployeeGraph(emp_id, freq_id, year, month) {
  try {
    if (freq_id > 1) {
      const res = await api.get(`/api/graph/emp/${encodeURIComponent(emp_id)}/freq/${encodeURIComponent(freq_id)}/yr/${encodeURIComponent(year)}/`);
      return { result: res };
    } else {
      const res = await api.get(`/api/graph/emp/${encodeURIComponent(emp_id)}/freq/${encodeURIComponent(freq_id)}/yr/${encodeURIComponent(year)}/mnt/${encodeURIComponent(month)}`);
      return { result: res };
    }
  } catch (exc) {
    console.log("could not get graph for employee : ", exc);
    return { error: exc }
  }
}

export async function getAllRoles() {
  try {
    const res = await api.get('/api/role');
    return { result: res, error: null };
  } catch (exc) {
    return { error: exc, return: null };
  }
}

export async function editKpiEntry(entry_id, data) {
  try {
    const res = await api.patch(
      `/api/kpi/value/id/${encodeURIComponent(entry_id)}`,
      data
    );
    return { result: res };
  } catch (exc) {
    console.log("Could not edit kpi entry ", exc);
    return { error: exc };
  }
}

export async function getKpiEntries_emp(kpi_id, emp_id) {
  try {
    const res = await api.get(
      `/api/kpi/value/all/kpi/${encodeURIComponent(
        kpi_id
      )}/emp/${encodeURIComponent(emp_id)}`
    );
    // console.log("getKpiEntries_emp",res);
    return { result: res.data };
  } catch (exc) {
    console.log("Could not get rows for kpi values for employee ", exc);
    return { error: exc };
  }
}

export async function google_login(credential) {
  const res = await api.post(`/login/google`, { credential: credential });
  if (res.status == 200) {
    return { result: res.data };
  } else if (res.status != 500) {
    return { error: `Failed to log in: ${res.data.error}` };
  } else {
    console.log("Could not log in :", res.data);
    return { error: `Server error!` };
  }
}

export async function addNewManagerReview(data) {
  const res = await api.post(`/api/manager/review`, data);
  if (res.status == 200) {
    return res.data;
  } else {
    throw new Error("Could not create new manager review");
  }
}
export async function editManagerReview(id, data) {
  const res = await api.patch(
    `/api/manager/review/${encodeURIComponent(id)}`,
    data
  );
  if (res.status == 200) {
    return res.data;
  } else {
    throw new Error("Could not create new manager review");
  }
}

export async function getAllManagerReviews() {
  const res = await api.get(`/api/manager/review`);
  if (res.status == 200) {
    return res.data;
  } else {
    throw new Error("Could not create new manager review");
  }
}

export async function getEmpManagerReviews(emp_id) {
  const res = await api.get(`/api/manager/review/emp/${encodeURIComponent(emp_id)}`);
  if (res.status == 200) {
    return res.data;
  } else {
    throw new Error("Could not create new manager review");
  }
}
export async function getAllValuesKpi(kpi_id) {
  const res = await api.get(
    `/api/kpi/value/all/kpi/${encodeURIComponent(kpi_id)}/`
  );
  if (res.status === 200) {
    return res.data;
  }
  throw new Error(`Unexpected status: ${res.status}`);
}
export async function getKpiGraph(emp_id) {
  try {
    const res = await api.get(`/api/graph/emp/${encodeURIComponent(emp_id)}`);
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`Unexpected status: ${res.status}`);
    }
  } catch (exc) {
    console.log("Error in getting kpi graph for employee " + emp_id);
    console.log(exc);
    throw new Error(exc);
  }
}
export async function getKpiVals_Employee(emp_id) {
  try {
    const res = await api.get(
      `/api/kpi/value/emp/${encodeURIComponent(emp_id)}/row`
    );
    return res;
  } catch (ex) {
    console.log("Could not fetch kpi values for employee " + emp_id);
    console.log(ex);
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
    const response = await api.get(
      `/api/designation/id/${encodeURIComponent(desgID)}/emps`
    );
    return response.data;
  } catch (ex) {
    console.log("Could not get employees under that designation!");
    throw new Error(ex);
  }
}
export const deleteForceKPI = async (id) => {
  try {
    const res = await api.delete(`/api/kpi/id/${encodeURIComponent(id)}/force`);
    return res;
  } catch (ex) {
    console.log(`Could not delete kpi: ${ex}`);
  }
};

export const getKPIID = async (id) => {
  try {
    const res = await api.get(`/api/kpi/id/${encodeURIComponent(id)}`);
    return res;
  } catch (ex) {
    console.log(`Could not delete kpi: ${ex}`);
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
    console.error("Could not fetch employees", error)
    const message = "Something went wrong while fetching employees";
    throw new Error(message);
  }
};
// Post Employee Details Api
export const createEmployee = async (employeeData) => {
  try {
    const response = await api.post("/api/createemployee", employeeData, {
      headers: {
        "Content-Type": "multipart/form-data", // Optional: Axios will usually handle this
      },
    });

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else if (response.status === 409) {
      return new Error(
        `An employee with that ${response.data.conflict} already exists: ${response.data.error}`
      );
    } else {
      return new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(
      `Could not create employee : ${JSON.stringify(error.response?.data)}`
    );
    const message =
      "Something went wrong while creating an employee: " +
      (error.response?.data?.error || error.message);
    return {
      id: null,
      success: false,
      error: error.response?.data?.error || message,
    };
  }
};

export const patchEmployee = async (empID, employeeData) => {
  try {
    const response = await api.patch(
      `/api/employee/id/${encodeURIComponent(empID)}`,
      employeeData, {
      headers: {
        "Content-Type": "multipart/form-data", // Optional: Axios will usually handle this
      },
    });

    if (response.status === 201 || response.status === 200) {
      return response.data;
    } else if (response.status === 409) {
      return new Error(
        `An employee with that ${response.data.conflict} already exists: ${response.data.error}`
      );
    } else {
      return new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(
      `Could not create employee : ${JSON.stringify(error.response?.data)}`
    );
    const message =
      "Something went wrong while creating an employee: " +
      (error.response?.data?.error || error.message);
    return {
      id: null,
      success: false,
      error: error.response?.data?.error || message,
    };
  }
};
// Edit Employee Details API
export const editEmployee = async (id, employeeData) => {
  try {
    const response = await api.patch(`/api/editemployee/${id}`, employeeData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      return response.data;
    } else if (response.status === 409) {
      return new Error(
        `An employee with that ${response.data.conflict} already exists: ${response.data.error}`
      );
    } else {
      return new Error(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.log(
      `Could not edit employee : ${JSON.stringify(error.response?.data)}`
    );
    const message =
      "Something went wrong while editing the employee: " +
      (error.response?.data?.error || error.message);
    return {
      id: null,
      success: false,
      error: error.response?.data?.error || message,
    };
  }
};

// Update Employee Status
export const updateEmployeeStatus = async ({ id, status }) => {
  try {
    const response = await api.patch(`/api/patch/changeemployeestatus`, {
      status,
      id,
    });
    if (response.status === 201 || response.status === 200) {
      return console.log("Employee Updated");
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
    const response = await api.get(
      "/api/designation/id/" + encodeURIComponent(id)
    );

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
    const response = await api.get(
      `/api/kpi/emp/${encodeURIComponent(emp_id)}`
    );
    return response;
  } catch (exc) {
    console.log(exc);
    const message = "Something went wrong while getting kpis for an employee";
    throw new Error(message);
  }
}

export async function addNewEntry(data) {
  try {
    const response = await api.post("/api/kpi/entry", data);
    if (response.status == 201 || response.status == 200) {
      return response.data;
    } else {
      throw new Error(`Unexpected status: ${response.status}`);
    }
  } catch (exc) {
    console.log(exc.response.data.error);
    const message = exc.response.data.error;
    throw new Error(message);
  }
}

export async function getKPIsForDesg(desg_id) {
  try {
    const response = await api.get(
      `/api/kpi/desg/${encodeURIComponent(desg_id)}`
    );
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
export async function getAllKpis() {
  try {
    const res = await api.get('/api/kpi');
    return { result: res, error: null };
  } catch (exc) {
    return { error: exc, result: null };
  }
}
export async function createKPI({
  title,
  description,
  frequency_id,
  target,
  yellow_threshold,
  green_threshold,
  designation_id,
  value_type,
}) {
  try {
    const response = await api.post("/api/kpi", {
      title,
      description,
      frequency_id,
      target,
      yellow_threshold,
      green_threshold,
      designation_id,
      value_type,
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

export async function editKPI({
  id,
  title,
  description,
  frequency_id,
  target,
  yellow_threshold,
  green_threshold,
  designation_id,
}) {
  try {
    const response = await api.patch("/api/kpi/id/" + encodeURIComponent(id), {
      title,
      description,
      frequency_id,
      target,
      yellow_threshold,
      green_threshold,
      designation_id,
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

// Edit Per Employee Kpi Targer
export const updateEmployeeTarget = async (id, updatedData) => {
  try {
    const response = await api.patch(`/api/kpi/${id}/kpi`, updatedData);
  } catch (error) {
    console.error("Update failed:", error);
  }
};