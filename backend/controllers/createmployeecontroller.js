const prisma = require("../prisma/prismaClient.js");

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
      where: { name: designation_id },
    });

    if (!designation) {
      return res.status(400).json({ error: "Invalid designation name." });
    }

    // 2. Check if department exists
    const department = await prisma.departments.findFirst({
      where: { name: department_id },
    });

    if (!department) {
      return res.status(400).json({ error: "Invalid department name." });
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
};
