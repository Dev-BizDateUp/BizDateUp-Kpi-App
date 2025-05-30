const pool = require("../config/db");

const createEmployeeController = async (req, res) => {
  const {
    employee_id,
    name,
    department_id,
    designation_id,
    company,
    employee_type,
    phone,
    email,
    image,
    status,
    role,
  } = req.body;

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
    !status ||
    !role
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO employees (
        employee_id, name, department_id, designation_id,
        company, employee_type, phone, email, image, status, role
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        employee_id,
        name,
        department_id,
        designation_id,
        company,
        employee_type,
        phone,
        email,
        image,
        status,
        role,
      ]
    );

    res.status(201).json({
      success: "Created Employee",
      employees: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getEmployeeController = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM employees");
    res.status(200).json({
      success: "Employees Fetched",
      employees: data.rows, // ✅ this returns all employees
    });
    return data.rows
  } catch (e) {
    console.error("Error fetching employees:", e);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  createEmployeeController,
  getEmployeeController,
};
