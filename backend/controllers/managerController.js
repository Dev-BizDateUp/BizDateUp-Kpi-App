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
    return res.status(500).json({
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
      review_type,
      review_year,
      review_month,
      review_quarter,
      review_date,
      summary_kpi,
      strengths,
      improvement,
      comment,
      actions,
      rating,
      goal,
      key_achievements,
      manager_feedback,
      employee,
    } = req.body;

    // force year from backend if missing
    review_year = Number.isInteger(review_year)
      ? review_year
      : new Date().getFullYear();

    /* ---------------- PERIOD VALIDATION ---------------- */

    if (review_type === "MONTHLY") {
      if (
        !Number.isInteger(review_month) ||
        review_month < 1 ||
        review_month > 12 ||
        (review_quarter !== null && review_quarter !== undefined)
      ) {
        return res.status(400).json({
          msg: "Invalid monthly review data",
        });
      }
      review_quarter = null;
    }

    if (review_type === "QUARTERLY") {
      if (
        !Number.isInteger(review_quarter) ||
        review_quarter < 1 ||
        review_quarter > 4 ||
        (review_month !== null && review_month !== undefined)
      ) {
        return res.status(400).json({
          msg: "Invalid quarterly review data",
        });
      }
      review_month = null;
    }

    /* ---------------- ACTIONS SAFE GUARD ---------------- */

    if (!Array.isArray(actions)) {
      actions = [];
    }

    const rt = rating !== undefined ? parseInt(rating) : null;

    /* ---------------- AUTHORIZATION ---------------- */

    const allowedEmployee = await prisma.employees.findFirst({
      where: {
        id: employee,
        manager_id: req.user.id,
      },
    });

    if (!allowedEmployee) {
      return res.status(403).json({
        msg: "You are not authorized to review this employee",
      });
    }

    /* ---------------- DUPLICATE CHECK ---------------- */

    const alreadyExists = await prisma.manager_review.findFirst({
      where: {
        employee_id: employee,
        manager_id: req.user.id,
        review_type,
        review_year,
        review_month,
        review_quarter,
      },
    });

    if (alreadyExists) {
      return res.status(409).json({
        msg: "Review already exists for this period",
      });
    }

    /* ---------------- CREATE REVIEW ---------------- */

    const review = await prisma.manager_review.create({
      data: {
        review_type,
        review_year,
        review_month,
        review_quarter,
        review_date: review_date ? new Date(review_date) : new Date(),
        summary_kpi,
        strengths,
        improvement,
        comment,
        actions,
        goals: goal,
        key_achievements,
        manager_feedback,
        rating: rt,
        employees: {
          connect: {
            id: employee,
          },
        },

        // manager creating review
        employees_manager_review_manager_idToemployees: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    return res.status(201).json({
      msg: "Created new manager review",
      data: review,
    });
  } catch (exc) {
    console.error(exc);
    return res.status(500).json({
      msg: "Failed to create manager review",
    });
  }
}

// const { zonedTimeToUtc } = require('date-fns-tz');
async function updateManagerReview(req, res) {
  const rev_id = Number(req.params.rev_id);
  try {
    const {
      summary_kpi,
      strengths,
      improvement,
      comment,
      rating,
      actions,
      goal,
      key_achievements,
      review_type,
      manager_feedback,
    } = req.body;
    const review = await prisma.manager_review.update({
      where: {
        id: rev_id,
      },
      data: {
        comment,
        goals: goal,
        improvement,
        rating: parseInt(rating),
        actions,
        strengths,
        summary_kpi,
        key_achievements,
        manager_feedback,
        review_type,
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
