const prisma = require("../prisma/prismaClient.js");
const { zonedTimeToUtc } = require("date-fns-tz");
const { buildEmployeeWhereClause } = require("../utils.js");

async function getEmpManagerReviews(req, res) {
  try {
    const emp_id = parseInt(req.params.emp_id);
    const revs = await prisma.manager_review.findMany({
      where: {
        employee_id: emp_id,
      },
    });
    let emp_data = await prisma.employees.findFirst({
      where: {
        id: emp_id,
      },
    });
    emp_data.designation = (
      await prisma.designations.findFirst({
        where: {
          id: emp_data.designation_id,
        },
      })
    ).name;
    return res.status(200).json({ rows: revs, employee: emp_data });
  } catch (exc) {
    return res
      .status(500)
      .json({
        error: "Server error while getting manager reviews for employee",
      });
  }
}
async function getAllManagerReviews(req, res) {
  try {
    const rows = await prisma.manager_review.findMany({
      where: buildEmployeeWhereClause(req.user),
      include: {
        employees: {
          select: {
            name: true,
            employee_id: true,
            designations: {
              select: {
                name: true,
              },
            },
            department_id: true,
          },
        },
      },
    });

    return res.status(200).json({ data: rows });
  } catch (exc) {
    return res
      .status(500)
      .json({ msg: "Could not get rows from manager reviews" });
  }
}

async function newManagerReview(req, res) {

  try {
    let {
      review_date,
      summary_kpi,
      strengths,
      improvement,
      comment,
      actions,
      rating,
      goal,
      employee, // employee ID
    } = req.body;

    // ensure actions is array
    if (!Array.isArray(actions)) {
      actions = [];
    }

    const rt = parseInt(rating);

    const review = await prisma.manager_review.create({
      data: {
        review_date: new Date(review_date),
        summary_kpi,
        strengths,
        improvement,
        comment,
        actions,
        goals: goal,
        rating: rt,
        // employee being reviewed
        employees: {
          connect: {
            id: employee,
          },
        },
        manager_name: req.user.name,
        // manager who created review
        employees_manager_review_manager_idToemployees: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    return res.status(200).json({
      msg: "Created new manager review",
      data: review,
    });
  } catch (exc) {
    console.error(exc);
    return res.status(500).json({ msg: "Failed to create manager review" });
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
      actions,
      goal,
      employee,
    } = req.body;

    const review = await prisma.manager_review.update({
      where: {
        id: rev_id,
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
        summary_kpi,
      },
    });

    return res.status(200).json({
      msg: "edited manager review",
      data: review,
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
  updateManagerReview,
};
