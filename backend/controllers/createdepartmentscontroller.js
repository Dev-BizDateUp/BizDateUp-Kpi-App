const prisma = require("../prisma/prismaClient.js");
const { buildEmployeeWhereClause, departmentwhereclause } = require("../utils.js");

const createDepartmentsController = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name field is required." });
  }
  try {
    const exsistingRecord = await prisma.departments.findFirst({
      where: {
        name: name,
      },
    });
    if (exsistingRecord) {
      return res.status(200).json({
        success: false,
        message: "Department Name Already Exsist",
      });
    }
    const result = await prisma.departments.create({
      data: {
        name: name,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Department Created",
      department: result,
    });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Department already exists." });
    }
    console.error("Error creating department:", err);
    res.status(500).json({ error: "Server error" });
  }
};

const getDepartmentsController = async (req, res) => {
  try {

    var whereClause = {};

    whereClause = {
      employees: {
        some: {
          manager_id: req.user.id,
        },
      },
    };
    const departments = await prisma.departments.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
      },
    });
    console.log("This is Departments Fetched ");
    
    console.log(departments);
    
    return res.status(200).json({
      success: true,
      message: "Departments fetched successfully For Paticular Person",
      data: departments,
    });
  } catch (e) {
    console.error("Error fetching departments:", e);
    res.status(500).json({ error: "Server error" });
  }
};

const getDepartmentDetails = async (req, res) => {
  const name = req.params.name;
  try {
    const departments = await prisma.departments.findFirst({
      where: { name: name },
      include: {
        designations: true,
        employees: true,
      },
    });
    if (departments) {
      return res.status(200).json({
        success: true,
        message: "Departments Data Fetched successfully",
        data: departments,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `Failed To Fetch ${name} Departments Data `,
      });
    }
  } catch (error) {
    console.error("Error fetching department details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createDepartmentsController,
  getDepartmentsController,
  getDepartmentDetails,
};
