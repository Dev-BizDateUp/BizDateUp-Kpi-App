const prisma = require("../prisma/prismaClient.js");

const checkUniqueParams = ['name', 'email', 'phone']
const checkUniqueParamsCreate = ['name', 'email', 'phone', 'employee_id']

const editEmployee = async (req, res) => {
  if (!req.params.emp_id) {
    return res.status(400).json({ error: "Employee ID is required in the URL." });
  }
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required." });
  }

  const {
    name,
    department_id, // department name
    designation_id, // designation name
    company,
    employee_type,
    phone,
    email,
    image,
    status,
  } = req.body;

  const employee_id = req.params.emp_id;
  console.log(`edit employee at id ${employee_id}`);
  // console.log(`employeed id to edit: ${employee_id}`);
  if (!employee_id) {
    return res.status(400).json({ error: "Employee ID is required in the URL." });
  }
  if (employee_id == undefined || employee_id == null) {
    return res.status(400).json({ error: "Employee ID is required in the URL." });
  }
  for (let index = 0; index < checkUniqueParams.length; index++) {
    const par = checkUniqueParams[index];
    const checkEmp = await prisma.employees.findFirst({
      where: JSON.parse(`{"${par}":"${req.body[par]}"}`),
    })
    console.log(`incoming id:${employee_id} found at ${checkEmp.employee_id}`);
    if (checkEmp && checkEmp.employee_id !== employee_id) {
      return res.status(409).json({
        conflict: par,
        error: `Employee with that ${par} already exist!`
      });
    }
  }

  try {
    // 1. Get existing employee
    const existingEmployee = await prisma.employees.findUnique({
      where: { employee_id: employee_id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    // 2. Prepare update object with fallbacks to existing values
    let department = null;
    let designation = null;

    if (department_id) {
      department = await prisma.departments.findFirst({ where: { id: department_id } });
      if (!department) return res.status(400).json({ error: "Invalid department name." });
    }

    if (designation_id) {
      designation = await prisma.designations.findFirst({ where: { id: designation_id } });
      if (!designation) return res.status(400).json({ error: "Invalid designation name." });
    }

    console.log(`Updating employee with ID: ${employee_id}`);
    console.log(`New designation: ${department_id}`);
    console.log(`New department: ${department_id}`);

    const updateData = {
      name: name,
      department_id: department ? department.id : existingEmployee.department_id,
      designation_id: designation ? designation.id : existingEmployee.designation_id,
      company: company,
      employee_type: employee_type,
      phone: phone,
      email: email,
      image: image,
      status: status,
    };

    // 3. Update the employee
    const updatedEmployee = await prisma.employees.update({
      where: { employee_id: employee_id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });

  } catch (err) {
    console.error("Error updating employee:", JSON.stringify(err));

    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Email or phone number already in use.",
      });
    }

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const createEmployeeController = async (req, res) => {
  const {
    employee_id,
    name,
    department_id, // Expecting department name
    designation_id, // Expecting designation name
    company,
    employee_type,
    phone,
    email,
    image,
    status,
  } = req.body;

  // Validate required fields
  if (
    !employee_id ||
    !name ||
    !department_id ||
    !designation_id ||
    !company ||
    !employee_type ||
    !phone ||
    !email ||
    !image ||
    !status
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // 1. Check if designation exists
    const designation = await prisma.designations.findFirst({
      where: { id: parseInt(designation_id) },
    });

    if (!designation) {
      return res.status(400).json({ error: "Invalid designation name." });
    }

    // 2. Check if department exists
    const department = await prisma.departments.findFirst({
      where: { id: parseInt(department_id) },
    });

    if (!department) {
      return res.status(400).json({ error: "Invalid department name." });
    }

    for (let index = 0; index < checkUniqueParamsCreate.length; index++) {
      const par = checkUniqueParamsCreate[index];
      const checkEmp = await prisma.employees.findFirst({
        where: JSON.parse(`{"${par}":"${req.body[par]}"}`)
      })
      if (checkEmp) {
        return res.status(409).json({
          conflict: par,
          error: `Employee with that ${par} already exist!`
        });
      }
    }

    // 3. Create employee
    const newEmployee = await prisma.employees.create({
      data: {
        employee_id,
        name,
        department_id: department.id, // Use actual ID
        designation_id: designation.id, // Use actual ID
        company,
        employee_type,
        phone,
        email,
        image,
        status,
      },
    });

    // Success response
    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);

    // Handle duplicate employee_id or email
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Employee ID or email already exists",
      });
    }

    // Generic server error
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

const getEmployeeController = async (req, res) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        departments: {
          select: { name: true },
        },
        designations: {
          select: {
            name: true,
          },
        },
      },
    });
    const formatted = employees.map((e) => ({
      employee_id: e.employee_id,
      name: e.name,
      designation: e.designations.name,
      department: e.departments?.name || null,
      company: e.company,
      employee_type: e.employee_type,
      phone: e.phone,
      email: e.email,
      image: e.image,
      status: e.status,
    }));

    res.status(200).json({
      success: "Employees Fetched",
      employees: formatted,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Server error" });
  }
};
const changeEmployeeStatus = async (req, res) => {
  const { status, id } = req.body;
  if (!status || !id) {
    return res.status(400).json({ error: "All Fields Are Required" });
  }
  // console.log(`Got edit status of employee ${id}`)
  try {
    const check_employee = await prisma.employees.findFirst({
      where: {
        employee_id: id,
      },
    });

    if (!check_employee) {
      return res.status(404).json({ error: "Employee Not Found" });
    }
    const result = await prisma.employees.update({
      where: {
        employee_id: id,
      },
      data: {
        status: status,
      },
    });

    if (result) {
      res.status(200).json({
        success: "Employee Status Updated",
        status: result,
      });
    }
  } catch (e) {
    return `Error In Updating The Employee Status ${e}`;
  }
};

module.exports = {
  createEmployeeController,
  getEmployeeController,
  changeEmployeeStatus,
  editEmployee
};
