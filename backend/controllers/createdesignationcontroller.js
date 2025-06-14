const prisma = require("../prisma/prismaClient.js");
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

    // console.log(desInDept);

    const lastDes = (await prisma.designations.count()) + 1;

    // Create designation
    const newDesignation = await prisma.designations.create({
      data: {
        name,
        department_id,
        id: lastDes,
      },
    });

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
    console.log(data);

    for (let index = 0; index < data.length; index++) {
      data[index].dept_name = depts.find(
        (d) => d.id === data[index].department_id
      ).name;
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

// const getDesignationID = async (req, res) => {
//   try {
//     const depts = await prisma.departments.findMany();
//     if (!depts) {
//       return res.status(500).json({ error: "Failed to get departments" });
//     }

//     let data = await prisma.designations.findFirst({
//       where: {
//         id: parseInt(req.params.id)
//       }
//     });

//     for (let index = 0; index < data.length; index++) {
//       data[index].dept_name = depts.find(d => d.id === data[index].department_id).name;
//     }
//     return res.status(200).json({
//       success: "Designation Fetched",
//       designation: data,
//     });

//   } catch (e) {
//     console.error("Error fetching Designation:", e);
//     return res.status(500).json({ error: "Server error" });
//   }
// };

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
};

