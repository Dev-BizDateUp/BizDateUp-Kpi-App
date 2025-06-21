const prisma = require("../prisma/prismaClient.js");
const { zonedTimeToUtc } = require('date-fns-tz');

async function getAllManagerReviews(req, res) {
    try {
        const rows = await prisma.manager_review.findMany({
            include: {
                employees: {
                    select: {
                        name: true,
                        employee_id:true,
                        designations: {
                            select: {
                                name:true
                            }
                        }
                    }
                }
            }
        });
        return res.status(200).json({ data: rows });
    } catch (exc) {
        console.log("Could not get manager reviews: ", exc);
        return res.status(500).json({ msg: "Could not get rows from manager reviews" })
    }
}


async function newManagerReview(req, res) {
    try {
        const {
            manager_name,
            review_date,
            summary_kpi,
            strengths,
            improvement,
            comment,
            rating,
            goal,
            employee
        } = req.body;

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
                rating,
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
        console.log("Could not create manager review", exc);
        return res.status(500).send();
    }
}

// const { zonedTimeToUtc } = require('date-fns-tz');

async function updateManagerReview(req, res) {
    const rev_id = parseInt(req.params.rev_id);
    try {
        const {
            manager_name,
            review_date,
            summary_kpi,
            strengths,
            improvement,
            comment,
            rating,
            goal,
            employee
        } = req.body;

        // Convert review_date (assumed to be in IST) to UTC
        // const reviewDateUtc = zonedTimeToUtc(review_date, 'Asia/Kolkata');

        const review = await prisma.manager_review.update({
            where: {
                id: rev_id
            },
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
                rating,
                review_date: new Date(review_date),
                strengths,
                summary_kpi
            }
        });

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
    updateManagerReview
}