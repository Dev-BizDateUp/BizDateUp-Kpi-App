
const { log } = require("console");
const prisma = require("../../prisma/prismaClient.js");
const { receiverwillgetemail, senderwillgetemail, sendWelcomeEmail } = require("../emailservice.js")

 function getISTMonthRange() {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000; // +05:30 in ms
  const now = new Date();

  // Current IST time
  const nowIST = new Date(now.getTime() + IST_OFFSET);

  // First day of month in IST (midnight)
  const startIST = new Date(
    nowIST.getFullYear(),
    nowIST.getMonth(),
    1, 0, 0, 0, 0
  );

  // Last day of month in IST (23:59:59.999)
  const endIST = new Date(
    nowIST.getFullYear(),
    nowIST.getMonth() + 1,
    0, 23, 59, 59, 999
  );

  // Convert IST times → UTC (for Postgres/Prisma)
  const gte = new Date(startIST.getTime() - IST_OFFSET);
  const lt = new Date(endIST.getTime() - IST_OFFSET);

  return { gte, lt, startIST, endIST }; // returning both for clarity
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
 const createBadge = async (req, res) => {
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
    console.log(giver);

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
console.log(newBadge);


    if (newBadge) {
      receiverwillgetemail(receiver.name, receiver.email)
      senderwillgetemail(giver.name, giver.email,receiver.name)
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
// @desc -  this will get the badges for particular employee that he/she had given to another employee for current month, and also check the number of badges remaining for current month
// @ parameters employee id a parametrer
 const getParticularemployeebadges = async (req, res) => {
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
// Desc -  Get Count Of Total Approved Badges For Particular User that he/she had given to other user 

 const getpartcularemployeecount = async (req, res) => {
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
    else {
      return res.status(200).json({
        message: "No Badges Approved Yet",
        success: true,
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
//  Api end point - /api/badge/get-all-badges/:id 
// @get Request 
// Parameter required: Employee ID
// @Desc -  This will fetch all the badges that user till now have given to other user
 const getallbadges = async (req, res) => {
  try {
    const { employee_id } = req.params;
    if (!employee_id) {
      return res.status(400).json({
        error: true,
        message: 'Employee Id Is Required'
      })
    }

    const { gte, lt } = getISTMonthRange();
    const getall_badges = await prisma.badges.findMany({
      where: {
        user_id: parseInt(employee_id),
      },
      include: {
        employees_badges_receiver_idToemployees: {
          select: { id: true, name: true },
        },
        employees_badges_user_idToemployees: {
          select: { id: true, name: true },
        },
      },
    })
    return res.status(200).json({
      message: "Fetched All Badges For Particular Employee",
      success: true,
      data: getall_badges
    });
  }
  catch (e) {
    res.status(500).json({
      message: "Failed To Fetch All Badges For Particular Employee",
      success: false,
      error: e.message,
    });
  }
}


// Api end point - /api/badge/get-approved-badge-count/:id
// @get Request
// Parameter required: Employee ID
// @Desc - This will fetch all the approved badges count for the particular user

 const getparticularempapprovedbadge = async (req, res) => {
  try {
    const { employee_id } = req.params;

    if (!employee_id) {
      return res.status(404).json({
        message: "Employee Name Required",
      });
    }
    const totalCount = await prisma.badges.count({
      where: {
        receiver_id: parseInt(employee_id),
        status: "Approved",
      },

    });

    if (totalCount) {
      return res.status(200).json({
        message: "Fetched Particular User Approved Badges Count",
        success: true,
        count: totalCount,
      });
    }
    else {
      return res.status(200).json({
        message: "No Badges Approved Yet For Particular User",
        success: true,
      });
    }
  } catch (e) {
    res.status(404).json({
      message: "Failed Fetched Particular User Approved Badges Count",
      error: true,
      error: e.message,
    });
  }
};


// Api end point - /api/badge/query
// @get Request
// Parameter Required -to send query parameter in query (?status=pending)
// @Desc -  This will fetch all the pending badges from the database 

 const getallbadgesforadmin = async (req, res) => {
  try {
    const fetchbadges = await prisma.badges.findMany({
      where: {
        status: "Pending"
      },
      include: {
        employees_badges_receiver_idToemployees: {
          select: { id: true, name: true },
        },
        employees_badges_user_idToemployees: {
          select: { id: true, name: true },
        },
      },
    })

    if (fetchbadges) {
      return res.status(200).json({
        message: "Fetched All Pending Badges For Admin",
        data: fetchbadges
      })
    }

    else {
      return res.status(200).json({
        message: "No Pending Badges Found",
        data: []
      });
    }
  }
  catch (e) {
    return res.status(500).json({
      message: "Error in Fetched All Pending Badges For Admin",
      message: e.message
    })
  }
}


// Api end point -  /api/badges/:id/actions
// @patch request 
// Parameter Required = Admin Id, reason if rejected , status, employee id
// @Desc - This will update the badge request if the approved then directly approved if rejected then it will need a reason and in badges column there will be field that will keep a track who have updated the badge 

 const updateBadgeStatus = async (req, res) => {

  try {
    const { admin_id, badge_id, status, reason } = req.body
    if (!admin_id || !badge_id || !status) {
      return res.status(404).json({
        message: "All Fields Are Required"
      })
    }
    const result = await prisma.$transaction(async (tx) => {

      const badge = await tx.badges.update({
        where: {
          badge_id: badge_id
        },
        data: {
          lastupdated_by: admin_id,
          status: status,
          reason: status === "Rejected" ? reason : null
        }
      })
      if (badge) {
        await tx.admin_actions.create({
          data: {
            badge_id: badge.badge_id,
            admin_id,
            action: status
          }
        })
      }
      return badge;
    })


    if (result) {

      res.status(200).json({
        "message": "Admin Updated the badge status",
        data: result
      })
    }
    // if(result.status === "Approved"){
    //   await approvebadgeemail()
    // }
  }
  catch (e) {
    return res.status(500).json({
      message: "Error in Updating Badges For Admin",
      message: e.message
    })
  }
}


 const getbadges = async (req, res) => {
  try {
    const fetchbadges = await prisma.badges.findMany({
      include: {
        employees_badges_receiver_idToemployees: {
          select: { id: true, name: true },
        },
        employees_badges_user_idToemployees: {
          select: { id: true, name: true },
        },
      },
    })

    if (fetchbadges) {
      return res.status(200).json({
        message: "Fetched All  Badges For Admin",
        data: fetchbadges
      })
    }

    else {
      return res.status(200).json({
        message: "No Pending Badges Found",
        data: []
      });
    }
  }
  catch (e) {
    return res.status(500).json({
      message: "Error in Fetching All   Badges For Admin",
      message: e.message
    })
  }
}
// Api For Fetching All The Users Approved Badge Count
 const fetchallapprovedbadgesforallusers = async (req, res) => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const data = await tx.badges.groupBy({
        by: ['receiver_id'],
        where: {
          status: "Approved"
        },
        _count: true
      })
      const id = data.map((i) => i.receiver_id)

      const fetchname = await tx.badges.findMany({
        where: {
          receiver_id: {
            in: id
          }
        },
        include: {
          employees_badges_receiver_idToemployees: {
            select: {
              name: true
            }
          }
        }
      })

      const main = data.map((i) => {
        const find = fetchname.find((u) => u.receiver_id === i.receiver_id)
        return {
          name: find.employees_badges_receiver_idToemployees.name || "No name",
          count: i._count
        }
      })
      return main;
    })


    return res.status(200).json({
      message: "Fetched approved badges and counts successfully.",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching approved counts:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


module.exports = {
  createBadge,
  getParticularemployeebadges,
  getpartcularemployeecount,
  getallbadges,
  getparticularempapprovedbadge,
  getallbadgesforadmin,
  updateBadgeStatus,
  getbadges,
  fetchallapprovedbadgesforallusers
}