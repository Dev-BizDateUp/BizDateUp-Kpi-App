import prisma from "../../prisma/prismaClient.js"


// @endpoint /api/badge/create-badge
// @desc   Store the user data in db 
// @parameters 
// interface data {
// giver_name:string,
// receiver_name: string,
// comment: string,
// status: string
// }

function getISTMonthRange() {
    const now = new Date();

    // First day of month in IST
    const firstDayIST = new Date(
        new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
            .setDate(1)
    );

    // First day of next month in IST
    const nextMonthIST = new Date(
        new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
            .setMonth(now.getMonth() + 1, 1)
    );

    return { gte: firstDayIST, lt: nextMonthIST };
}

export const createBadge = async (req, res) => {
    const { giver_name, receiver_name, comment, status } = req.body
    try {
        if (!giver_name || !receiver_name || !comment || !status) {
            return res.status(400).json({
                message: "All Fields Required",
                error: true
            })
        }
        const giver = await prisma.employees.findFirst({
            where: {
                name: giver_name
            }
        })
        if (!giver) {
            return res.status(404).json({ message: "User not found" });
        }

        const receiver = await prisma.employees.findFirst({
            where: {
                name: receiver_name
            }
        })
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

        if (badgeCount === 3) {
            return res.status(404).json({
                message: "You have Exceed The Monthly Quota"
            })
        }
        const newBadge = await prisma.badges.create({
            data: {
                user_id: giver.id,
                receiver_id: receiver.id,
                status: "Pending",
                comment: comment
            }
        })
        if (newBadge) {
            return res.status(200).json({
                message: "Success Created new Badge",
                data: newBadge,
                badgecount: badgeCount
            })
        }
        else {
            return res.status(400).json({
                message: "Failed To Created new Badge",
            })
        }
    } catch (e) {
        res.status(404).json({
            message: "Failed To Make Badge",
            error: true,
            error: e.message
        })
    }
}
//  @endpoint /api/badge/get-employee-badge/${employee_id}
// @get request 
// @desc - this will get the badges for particular employee and also check the number of badges remaining, number of badges remaining, 
// @ parameters employee id a parametrer

export const getParticularemployeebadges = async (req, res) => {
    try {
        const { employee_id } = req.params
        if (!employee_id) {
            return res.status(404).json({
                message: "Employee Name Required"
            })
        }
        const { gte, lt } = getISTMonthRange();
        const badgeCount = await prisma.badges.count({
            where: {
                user_id: parseInt(employee_id),
                created_at: { gte, lt },
            },
        });

        const finduser = await prisma.badges.findFirst({
            where: {
                user_id: parseInt(employee_id)
            }
        })
        const finduser_name = await prisma.employees.findFirst({
            where: {
                id: parseInt(finduser.receiver_id)
            }
        })

        if (finduser) {
            return res.status(200).json({
                message: "Successfully Fetched The Badges",
                data: {
                    finduser,
                    name: finduser_name.name
                },
                success: true,
                badgeCount: badgeCount
            })
        }
    }
    catch (e) {
        res.status(404).json({
            message: "Failed To Fetch Badge Details",
            error: true,
            error: e.message
        })
    }
}
//  Api end point - /api/badge/get-badge-count/:id
//  get request 
// Desc -  Get Count Of Total Approved Badges For Particular User

export const getpartcularemployeecount = async (req, res) => {
    try {
        const { employee_id } = req.params

        if (!employee_id) {
            return res.status(404).json({
                message: "Employee Name Required"
            })
        }
        const totalCount = await prisma.badges.count({
            where: {
                user_id: parseInt(employee_id),
                status: "Approved"
            }
        })
        if (totalCount) {
            return res.status(200).json({
                message: "Fetched User Badges Count",
                success: true,
                count: totalCount || []
            })
        }
    }
    catch (e) {
        res.status(404).json({
            message: "Failed To Fetch Badge Count",
            error: true,
            error: e.message
        })
    }
} 