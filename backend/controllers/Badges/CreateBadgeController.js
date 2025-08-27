import prisma from "../../prisma/prismaClient.js";

function getISTMonthRange() {
  const now = new Date();

  // First day of month in IST
  const firstDayIST = new Date(
    new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })).setDate(
      1
    )
  );

  // First day of next month in IST
  const nextMonthIST = new Date(
    new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    ).setMonth(now.getMonth() + 1, 1)
  );

  return { gte: firstDayIST, lt: nextMonthIST };
}

// @endpoint /api/badge/create-badge
// @desc   Store the user data in db
// @parameters
// interface data {
// giver_name:string,
// receiver_name: string,
// comment: string,
// status: string
// }
export const createBadge = async (req, res) => {
  const { giver_name, receiver_name, comment, status } = req.body;
  try {
    if (!giver_name || !receiver_name || !comment || !status) {
      return res.status(400).json({
        message: "All Fields Required",
        error: true,
      });
    }
    const giver = await prisma.employees.findFirst({
      where: {
        name: giver_name,
      },
    });
    if (!giver) {
      return res.status(404).json({ message: "User not found" });
    }
    const receiver = await prisma.employees.findFirst({
      where: {
        name: receiver_name,
      },
    });

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    const { gte, lt } = getISTMonthRange();
    const badgeCount = await prisma.badges.count({
      where: {
        user_id: giver.id,
        created_at: { gte, lt },
      },
    });
    const totalCount = badgeCount + 1;
    if (totalCount === 4) {
      return res.status(404).json({
        message: "You have Exceed The Monthly Quota",
      });
    }
    const newBadge = await prisma.badges.create({
      data: {
        user_id: giver.id,
        receiver_id: receiver.id,
        status: "Pending",
        comment: comment,
      },
    });
    if (newBadge) {
      return res.status(200).json({
        message: "Success Created new Badge",
        newBadge,
        totalCount: totalCount,
      });
    } else {
      return res.status(400).json({
        message: "Failed To Created new Badge",
      });
    }
  } catch (e) {
    res.status(404).json({
      message: "Failed To Make Badge",
      error: true,
      error: e.message,
    });
  }
};

//  @endpoint /api/badge/get-employee-badge/${employee_id}
// @get request
// @desc - this will get the badges for particular employee and also check the number of badges remaining. for that particular month only.
// @ parameters employee id a parametrer

export const getParticularemployeebadges = async (req, res) => {
  try {
    const { employee_id } = req.params;
    if (!employee_id) {
      return res.status(404).json({
        message: "Employee Name Required",
      });
    }
    const { gte, lt } = getISTMonthRange();
    const finduser = await prisma.badges.findMany({
      where: {
        user_id: parseInt(employee_id),
        created_at: { gte, lt },
      },
      include: {
        employees_badges_receiver_idToemployees: {
          select: { id: true, name: true },
        },
        employees_badges_user_idToemployees: {
          select: { id: true, name: true },
        },
      },
    });
    if (finduser) {
      return res.status(200).json({
        message: "Successfully Fetched The Badges",
        finduser,
        success: true,
      });
    }
  } catch (e) {
    res.status(404).json({
      message: "Failed To Fetch Badge Details",
      error: true,
      error: e.message,
    });
  }
};
//  Api end point - /api/badge/get-badge-count/:id
//  get request
// Desc -  Get Count Of Total Approved Badges For Particular User

export const getpartcularemployeecount = async (req, res) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res.status(404).json({
        message: "Employee Name Required",
      });
    }
    const totalCount = await prisma.badges.count({
      where: {
        user_id: parseInt(employee_id),
        status: "Approved",
      },
    });

    if (totalCount) {
      return res.status(200).json({
        message: "Fetched User Badges Count",
        success: true,
        count: totalCount,
      });
    }
  } catch (e) {
    res.status(404).json({
      message: "Failed To Fetch Badge Count",
      error: true,
      error: e.message,
    });
  }
};
