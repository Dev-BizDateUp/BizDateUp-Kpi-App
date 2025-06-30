const prisma = require("../prisma/prismaClient.js");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../supabase.js");

const truncateFilename = (name) => name.replace(/\s+/g, "-").slice(0, 50);
const extractStoragePath = (url) => {
  const parts = url.split("/storage/v1/object/public/images/");
  return parts[1] || null;
};

const editEmployee = async (req, res) => {
  try {
    const employee_id = req.params.emp_id;
    if (!employee_id) return res.status(400).json({ error: "Employee ID is required in the URL." });

    const {
      name,
      department_id,
      designation_id,
      company,
      employee_type,
      phone,
      email,
      status
    } = req.body;

    const image = req.file;

    const existingEmployee = await prisma.employees.findUnique({
      where: { employee_id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    // Unique checks (excluding self)
    const checks = [
      { field: "email", value: email },
      { field: "phone", value: phone },
      { field: "name", value: name }
    ];

    for (const check of checks) {
      if (!check.value) continue;
      const found = await prisma.employees.findFirst({
        where: {
          [check.field]: check.value,
          NOT: { employee_id },
        },
      });
      if (found) {
        return res.status(409).json({ conflict: check.field, error: `${check.field} already in use.` });
      }
    }

    // Validate foreign keys
    const validateEntity = async (model, id, label) => {
      if (!id) return null;
      const record = await model.findFirst({ where: { id } });
      if (!record) {
        res.status(400).json({ error: `Invalid ${label}.` });
        return null;
      }
      return record;
    };

    const department = await validateEntity(prisma.departments, department_id, "department");
    if (department_id && !department) return;

    const designation = await validateEntity(prisma.designations, designation_id, "designation");
    if (designation_id && !designation) return;

    let imageUrl = existingEmployee.image;

    if (image) {
      // Delete old image if exists
      if (existingEmployee.image) {
        const path = extractStoragePath(existingEmployee.image);
        if (path) await supabase.storage.from("images").remove([path]);
      }

      // Upload new image
      const filePath = `profile-pics/${uuidv4()}-${Date.now()}-${truncateFilename(image.originalname)}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, image.buffer, {
          contentType: image.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Upload failed:", uploadError);
        return res.status(500).json({ error: "Failed to upload image." });
      }

      const { data: urlData } = supabase.storage.from("images").getPublicUrl(filePath);
      imageUrl = urlData?.publicUrl;
    }

    const updateData = {
      name,
      department_id: department ? department.id : existingEmployee.department_id,
      designation_id: designation ? designation.id : existingEmployee.designation_id,
      company,
      employee_type,
      phone,
      email,
      status,
      image: imageUrl,
    };

    const updatedEmployee = await prisma.employees.update({
      where: { employee_id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (err) {
    console.error("Error updating employee:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


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
    status,
  } = req.body;

  const image = req.file;

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
    !status
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // if (!image) {
  //   return res.status(400).json({ error: "Image is required." });
  // }

  try {
    // 1. Check if designation exists
    const designation = await prisma.designations.findFirst({
      where: { id: parseInt(designation_id) },
    });

    if (!designation) {
      return res.status(400).json({ error: "Invalid designation ID." });
    }

    // 2. Check if department exists
    const department = await prisma.departments.findFirst({
      where: { id: parseInt(department_id) },
    });

    if (!department) {
      return res.status(400).json({ error: "Invalid department ID." });
    }

    // 3. Uniqueness checks


    let existing = await prisma.employees.findFirst({
      where: { name: req.body.name },
    });
    if (existing) {
      return res.status(409).json({
        conflict: 'name',
        error: `Employee with that name already exists!`,
      });
    }
    existing = null;
    existing = await prisma.employees.findFirst({
      where: { email: req.body.email },
    });
    if (existing) {
      return res.status(409).json({
        conflict: 'email',
        error: `Employee with that email already exists!`,
      });
    }
    existing = null;
    existing = await prisma.employees.findFirst({
      where: { phone: req.body.phone },
    });
    if (existing) {
      return res.status(409).json({
        conflict: 'phone',
        error: `Employee with that phone already exists!`,
      });
    }
    existing = null;
    existing = await prisma.employees.findFirst({
      where: { employee_id: req.body.employee_id },
    });
    if (existing) {
      return res.status(409).json({
        conflict: 'employee_id',
        error: `Employee with that employee id already exists!`,
      });
    }
    existing = null;


    // 5. Create employee
    const newEmployee = await prisma.employees.create({
      data: {
        employee_id,
        name,
        department_id: department.id,
        designation_id: designation.id,
        company,
        employee_type,
        phone,
        email,
        status,
      },
    });

    // 4. Upload image to Supabase only after creating employee successfully
    if (image) {
      const filePath = `profile-pics/${uuidv4()}-${new Date().getTime()}-${truncateFilename(
        image.originalname
      )}`;
      const { error: uploadError } = await supabase.storage
        .from("images") // your Supabase bucket
        .upload(filePath, image.buffer, {
          contentType: image.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return res.status(500).json({ error: "Failed to upload image." });
      }
    }


    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const publicImageUrl = publicUrlData?.publicUrl;

    await prisma.employees.update({
      where: { employee_id: newEmployee.employee_id },
      data: {
        image: publicImageUrl, // Update employee with the image URL
      },
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: newEmployee,
    });
  } catch (err) {
    console.error("Error creating employee:", err);

    if (err.code === "P2002") {
      return res.status(409).json({
        error: "Employee ID, phone, or email already exists.",
      });
    }

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
          select: { name: true, id: true },
        },
        designations: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
    const formatted = employees.map((e) => ({
      employee_id: e.employee_id,
      name: e.name,
      designation: e.designations.name,
      designation_id: e.designations.id,
      department: e.departments?.name || null,
      department_id: e.departments?.id || null,
      company: e.company,
      employee_type: e.employee_type,
      phone: e.phone,
      email: e.email,
      image: e.image,
      status: e.status,
      id: e.id,
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
  editEmployee,
};
