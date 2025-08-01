const prisma = require("../prisma/prismaClient.js");

const validateDesignationInput = ({ name, department_id }) => {
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string.");
  }
  if (!department_id || isNaN(department_id)) {
    errors.push("Valid department_id is required.");
  }
  return errors;
};

const getDesignationEmployees = async (req, res) => {
  const desg = parseInt(req.params.id);
  try {
    const emps = await prisma.employees.findMany({
      where: {
        designation_id: desg
      }
    });
    return res.status(200).json({ data: emps });
  } catch (ex) {
    return res.status(500).json({ error: "Could not find exployees for that designation" })
  }
}

// const createDesignationController = async (req, res) => {
//   const { name, department_id } = req.body;
//   const errors = validateDesignationInput({ name, department_id });
//   if (errors.length) {
//     return res.status(400).json({ errors });
//   }

//   try {
//     const { rowCount } = await pool.query(
//       "SELECT 1 FROM departments WHERE id = $1",
//       [department_id]
//     );
//     if (!rowCount) {
//       return res.status(400).json({ errors: ["Department not found."] });
//     }

//     const { rows } = await pool.query(
//       `INSERT INTO designations (name, department_id) VALUES ($1, $2) RETURNING *`,
//       [name.trim(), department_id]
//     );

//     return res.status(201).json({ data: rows[0], message: "Designation created successfully" });
//   } catch (error) {
//     console.error("createDesignation error:", error);
//     return res.status(500).json({ errors: ["Internal Server Error"] });
//   }
// };
const createDesignationController = async (req, res) => {
  const { name, department_id } = req.body;


  try {
    // Check if department exists (only if department_id is provided)
    if (department_id) {
      const department = await prisma.departments.findUnique({
        where: {
          id: department_id,
        },
      });

      if (!department) {
        return res.status(400).json({ error: "Department Not Found" });
      }
    }

    const desInDept = await prisma.designations.findMany({
      where: {
        name: name,
      },
    });

    if (desInDept.length > 0) {
      return res.status(409).json({
        conflict: "name",
        error: "Designation with that name already exists",
      });
    }



    // Create designation
    let newDesignation = await prisma.designations.create({
      data: {
        name,
        department_id,
        id: Math.floor(Math.random() * 99999999)
      },
    });

    newDesignation.dept_name = (await prisma.departments.findUnique({
      where: {
        id: department_id,
      },
      select: {
        name: true,
      },
    })).name;

    return res.status(201).json({
      message: "Designation created successfully",
      data: newDesignation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDesignationController = async (req, res) => {
  try {
    const depts = await prisma.departments.findMany();
    if (!depts) {
      return res.status(500).json({ error: "Failed to get departments" });
    }

    let data = await prisma.designations.findMany();

    for (let index = 0; index < data.length; index++) {
      data[index].dept_name = depts.find(
        (d) => d.id === data[index].department_id
      ).name;
      data[index].emp_count = await prisma.employees.count({
        where: {
          designation_id: data[index].id,
        },
      });
    }
    return res.status(200).json({
      success: "Designation Fetched",
      designation: data,
    });
  } catch (e) {
    console.error("Error fetching Designation:", e);
    return res.status(500).json({ error: "Server error" });
  }
};

const getDesignationID = async (req, res) => {
  try {
    const depts = await prisma.departments.findMany();
    if (!depts) {
      return res.status(500).json({ error: "Failed to get departments" });
    }

    let data = await prisma.designations.findFirst({
      where: {
        id: parseInt(req.params.id)
      }
    });

    for (let index = 0; index < data.length; index++) {
      data[index].dept_name = depts.find(d => d.id === data[index].department_id).name;
    }
    return res.status(200).json({
      success: "Designation Fetched",
      designation: data,
    });

  } catch (e) {
    console.error("Error fetching Designation:", e);
    return res.status(500).json({ error: "Server error" });
  }
};

const getemployeesanddesignation = async (req, res) => {
  try {
    const data = await prisma.departments.findMany({
      include: {
        designations: {
          include: {
            _count: {
              select: {
                employees: true,
              },
            },
            departments: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    const cleandata = data.map((item) => ({
      dept_name: item.name,
      designations: item.designations.map((item) => ({
        des_name: item.name,
        count: item._count,
      })),
    }));

    if (!data) {
      return res.status(400).json({
        data: data,
        message: "Failed To Fetched The Data",
      });
    } else {
      return res.status(200).json({
        data: cleandata,
        message: "Data Fetched",
      });
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createDesignationController,
  getDesignationController,
  getemployeesanddesignation,
  getDesignationID,
  getDesignationEmployees
};

