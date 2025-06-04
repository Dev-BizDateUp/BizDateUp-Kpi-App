const prisma = require("../prisma/prismaClient.js");

const createDepartmentsController = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const result = await prisma.departments.create({
      data: {
        name: name,
      },
    });
    res.status(201).json({
      success: "Department Created",
      department: result,
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Department already exists." });
    }
    console.error("Error creating department:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getDepartmentsController = async (req, res) => {
  try {
    const data = await prisma.departments.findMany()
    res.status(200).json({
      success: "Departments Fetched",
      departments: data,
    });
    return data;
  } catch (e) {
    console.error("Error  fetching departments:", e);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createDepartmentsController,
  getDepartmentsController,
};
