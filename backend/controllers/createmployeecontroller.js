const prisma = require("../prisma/prismaClient.js");

const createEmployeeController = async (req, res) => {
  const {
    employee_id,
    name,
    department_id,
    designation_id, // this is expected to be a string like "Manager"
    company,
    employee_type,
    phone,
    email,
    image,
    status,
  } = req.body;

  if (
    !employee_id || !name || !department_id || !designation_id ||
    !company || !employee_type || !phone || !email || !image || !status
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Lookup designation ID
    const designationCheck = await pool.query(
      "SELECT id FROM designations WHERE name = $1",
      [designation_id]
    );

       

    if (designationCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid designation name." });
    }
    
    const resolvedDesignationId = designationCheck.rows[0].id;

    const departmentcheck = await pool.query(
      "SELECT id FROM departments WHERE name = $1",
      [department_id]
    );
 if (departmentcheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid Department name." });
    }
    
    const resolvedDepartmentId = departmentcheck.rows[0].id;


    const result = await pool.query(
      `INSERT INTO employees (
        employee_id, name, department_id, designation_id,
        company, employee_type, phone, email, image, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        employee_id,
        name,
        resolvedDepartmentId,
        resolvedDesignationId, // ✅ fixed here
        company,
        employee_type,
        phone,
        email,
        image,
        status,
      ]
    );

    res.status(201).json({
      success: "Created Employee",
      employee: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getEmployeeController = async (req, res) => {
  try {
    const employees = await prisma.employees.findMany({
      include: {
        departments: {
          select: { name: true },
        },
      },
    });
    const formatted = employees.map((e) => ({
      employee_id: e.employee_id,
      name: e.name,
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
  try {
    const check_employee = await pool.query(
      "SELECT * from employees WHERE employee_id = $1",
      [id]
    );
    if (check_employee.rowCount === 0) {
      return res.status(404).json({ error: "Employee Not Found" });
    }
    const result = await pool.query(
      "UPDATE employees SET status = $1 WHERE employee_id = $2 RETURNING *",
      [status, id]
    );
    if (result){
      res.status(200).json({
        success:"Employee Status Updated",
        status:result.rows[0]
      })
    }
  } catch (e) {
    return `Error In Updating The Employee Status ${e}`
  }
};

module.exports = {
  createEmployeeController,
  getEmployeeController,
  changeEmployeeStatus
};
