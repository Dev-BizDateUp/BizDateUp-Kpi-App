const pool = require("../config/db");

const createDepartmentsController = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO departments (name) VALUES ($1) RETURNING *`,
      [name]
    );

    res.status(201).json({
      success: "Department Created",
      department: result.rows[0],
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Department already exists." });
    }

    console.error("Error creating department:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createDepartmentsController,
};
