const prisma = require("../prisma/prismaClient.js");

async function getAllManagerReviews(req, res) {
    try {
        const rows = await prisma.manager_review.findMany({
            include: {
                employees: {
                    select: {
                        name: true,
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
        })

    } catch (exc) {
        console.log("Could not create manager review", exc);
        return res.status(500);
    }
}

module.exports = {
    newManagerReview,
    getAllManagerReviews
}