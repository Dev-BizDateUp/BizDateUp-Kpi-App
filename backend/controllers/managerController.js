const prisma = require("../prisma/prismaClient.js");
const { zonedTimeToUtc } = require('date-fns-tz');

async function getEmpManagerReviews(req, res) {
    try {
        const emp_id = parseInt(req.params.emp_id);
        const revs = await prisma.manager_review.findMany({
            where: {
                employee_id: emp_id
            }
        });
        let emp_data = await prisma.employees.findFirst({
            where: {
                id: emp_id
            }
        })
        emp_data.designation = (await prisma.designations.findFirst({
            where: {
                id: emp_data.designation_id
            }
        })).name;
        return res.status(200).json({ rows: revs, employee: emp_data });
    } catch (exc) {
        return res.status(500).json({ error: "Server error while getting manager reviews for employee" })
    }
}
async function getAllManagerReviews(req, res) {
    try {
        const rows = await prisma.manager_review.findMany({
            include: {
                employees: {
                    select: {
                        name: true,
                        employee_id: true,
                        designations: {
                            select: {
                                name: true
                            }
                        },
                        department_id: true
                    }
                }
            }
        });
        return res.status(200).json({ data: rows });
    } catch (exc) {
        return res.status(500).json({ msg: "Could not get rows from manager reviews" })
    }
}


async function newManagerReview(req, res) {
    try {
        let {
            manager_name,
            review_date,
            summary_kpi,
            strengths,
            improvement,
            comment,
            actions,
            rating,
            goal,
            employee
        } = req.body;

        if (actions == false) {
            actions = []
        }

        const rt = parseInt(rating);

        // Convert input (assumed IST) to UTC
        // const reviewDateUtc = zonedTimeToUtc(review_date, 'Asia/Kolkata');

        const review = await prisma.manager_review.create({
            data: {
                comment,
                employees: {
                    connect: {
                        id: employee.id
                    }
                },
                goals: goal,
                improvement,
                manager_name,
                rating: rt,
                actions,
                review_date: new Date(review_date),
                strengths,
                summary_kpi
            }
        });

        return res.status(200).json({
            msg: "created new manager review",
            data: review
        });

    } catch (exc) {
        return res.status(500).send();
    }
}

// const { zonedTimeToUtc } = require('date-fns-tz');

async function updateManagerReview(req, res) {
    const rev_id = parseInt(req.params.rev_id);
    console.log(rev_id);
    
    try {
        const {
            manager_name,
            review_date,
            summary_kpi,
            strengths,
            improvement,
            comment,
            rating,
            actions,
            goal,
            employee
        } = req.body;

        const review = await prisma.manager_review.update({
            where: {    
                id: rev_id
            },
            data: {
                comment,
                
                goals: goal,
                improvement,
                manager_name,
                rating: parseInt(rating),
                actions,
                review_date: new Date(review_date),
                strengths,
                summary_kpi
            }
        });
console.log(review);

        return res.status(200).json({
            msg: "edited manager review",
            data: review
        });

    } catch (exc) {
        console.error("Could not update manager review", exc);
        return res.status(500).send();
    }
}

module.exports = {
    newManagerReview,
    getAllManagerReviews,
    getEmpManagerReviews,
    updateManagerReview
}