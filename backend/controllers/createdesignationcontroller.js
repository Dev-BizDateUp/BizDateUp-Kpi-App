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
        return res.status(400).json({ error: 'Department Not Found' });
      }
    }

    const desInDept = await prisma.designations.findMany(
      {
        where: {
          name: name
        }
      }
    )

    if (desInDept.length > 0) {
      return res.status(409).json({
        conflict: "name",
        error: "Designation with that name already exists"
      })
    }

    // console.log(desInDept);

    const lastDes = await prisma.designations.count() + 1;

    // Create designation
    const newDesignation = await prisma.designations.create({
      data: {
        name,
        department_id,
        id: lastDes
      },
    });


    return res.status(201).json({
      message: 'Designation created successfully',
      data: newDesignation,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
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
      data[index].dept_name = depts.find(d => d.id === data[index].department_id).name;
    }
    return res.status(200).json({
      success: "Designation Fetched",
      designation: data,
    });
    return data;
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
    return data;
  } catch (e) {
    console.error("Error fetching Designation:", e);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createDesignationController,
  getDesignationController,
  getDesignationID
};

// createDesignationController
