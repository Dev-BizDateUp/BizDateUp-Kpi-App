const e = require("express");
const prisma = require("../../prisma/prismaClient.js");
const dayjs = require("dayjs");
const { getMonthName } = require("../../utils.js");
// api endpoint - /api/automation/daily_entries
// desc - This controller is used by user for daily entries

// Required payload from frontend
// {
//   "entry_date": "2026-01-04",
//   "kpis": [
//     { "kpi_id": 38, "value": 75 },
//     { "kpi_id": 41, "value": 1 },
//     { "kpi_id": 42, "value": 90 },
//     { "kpi_id": 45, "value": 0 }
//   ]
// }

const daily_entries = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const { entry_date, kpis } = req.body;

    /* 1️⃣ Validate request body */
    if (!entry_date || !Array.isArray(kpis) || kpis.length === 0) {
      return res.status(400).json({
        message: "entry_date and kpis are required",
      });
    }

    /* 2️⃣ Validate KPI IDs */
    const kpiIds = kpis.map((k) => k.kpi_id);

    const existingKpis = await prisma.kpis.findMany({
      where: {
        id: { in: kpiIds },
      },
    });

    if (existingKpis.length !== kpiIds.length) {
      return res.status(400).json({
        message: "One or more KPI IDs are invalid",
      });
    }

    /* 3️⃣ Date validation (today or last 2 days) */
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [year, month, day] = entry_date.split("-").map(Number);
    const entryDate = new Date(Date.UTC(year, month - 1, day));

    if (isNaN(entryDate.getTime())) {
      return res.status(400).json({
        message: "Invalid entry_date format. Use YYYY-MM-DD",
      });
    }

    const diffDays =
      (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24);

    // if (diffDays < 0 || diffDays > 2) {
    //   return res.status(400).json({
    //     message: "You can fill KPI only for today or last 2 days",
    //   });
    // }

    /* 4️⃣ BLOCK DUPLICATE SUBMISSION */
    const alreadyExists = await prisma.employee_daily_kpi_entries.findFirst({
      where: {
        employee_id,
        entry_date: entryDate,
      },
    });

    if (alreadyExists) {
      return res.status(409).json({
        message: "KPI data already exists for this date",
      });
    }

    /* 5️⃣ Create KPI entries (NO UPSERT) */
    const operations = kpis.map((k) =>
      prisma.employee_daily_kpi_entries.create({
        data: {
          employee_id,
          kpi_id: k.kpi_id,
          entry_date: entryDate,
          value: k.value,
        },
      }),
    );

    await prisma.$transaction(operations);

    return res.status(201).json({
      message: "Daily KPI saved successfully",
    });
  } catch (error) {
    console.error("Daily KPI Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// api end point - /api/automation/get_indiviual_entries
// request - get request
// desc - check that entries from daily entries exsisit in manager approval table if not then fetch and show that to user
const get_daily_entries = async (req, res) => {
  try {
    const employeeId = req.user.id;

    // 1️⃣ Fetch daily entries
    const entries = await prisma.employee_daily_kpi_entries.findMany({
      where: {
        employee_id: employeeId,
      },
      orderBy: {
        entry_date: "asc",
      },
      select: {
        id: true,
        entry_date: true,
        value: true,
        kpis: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });

    // 2️⃣ Fetch approved periods (minimal fields)
    const approvals = await prisma.manager_kpi_approvals.findMany({
      where: {
        employee_id: employeeId,
        approval_status: "APPROVED",
      },
      select: {
        period_start: true,
        period_end: true,
      },
    });

    // 3️⃣ Filter entries NOT falling in approved periods
    const pendingEntries = entries.filter((entry) => {
      return !approvals.some((approval) => {
        return (
          entry.entry_date >= approval.period_start &&
          entry.entry_date <= approval.period_end
        );
      });
    });

    return res.status(200).json({
      message: "Fetched Individual KPI Entries",
      success: true,
      data: pendingEntries,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed in fetching Individual KPI entries",
      success: false,
      error: e.message,
    });
  }
};
/**
 * @route   GET /api/automation/get_weekly_entries_for_manager/:emp_id/:month/:year
 * @desc    Get weekly KPI entries for a manager (month-wise)
 * @access  Private (Manager)
 */
const get_weekly_entries_for_manager = async (req, res) => {
  try {
    const { emp_id, month, year } = req.params;

    const initialDate = dayjs(`${year}-${month}-01`);
    const startDate = initialDate.startOf("month").toDate();
    const endDate = initialDate.endOf("month").toDate();

    const get_dailyentries = await prisma.employee_daily_kpi_entries.findMany({
      where: {
        employee_id: Number(emp_id),
        entry_date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        value: true,
        entry_date: true,
        kpis: {
          select: {
            title: true,
            target: true,
          },
        },
      },
    });

    if (get_dailyentries.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const weeklyMap = {};

    for (const entry of get_dailyentries) {
      const entryDate = dayjs(entry.entry_date);
      const dayOfMonth = entryDate.date();
      const weekNumber = Math.ceil(dayOfMonth / 7);

      const weekStartDay = (weekNumber - 1) * 7 + 1;
      const weekEndDay = Math.min(weekStartDay + 6, entryDate.daysInMonth());

      const weekStart = entryDate
        .clone()
        .date(weekStartDay)
        .format("YYYY-MM-DD");
      const weekEnd = entryDate.clone().date(weekEndDay).format("YYYY-MM-DD");

      const weekKey = `${weekStart}_${weekEnd}`;

      if (!weeklyMap[weekKey]) {
        weeklyMap[weekKey] = {
          week_start: weekStart,
          week_end: weekEnd,
          entries: [],
        };
      }

      weeklyMap[weekKey].entries.push(entry);
    }

    const weeklyData = Object.values(weeklyMap);

    const get_manager_approval_entries =
      await prisma.manager_kpi_approvals.findMany({
        where: {
          employee_id: Number(emp_id),
          period_start: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          period_start: true,
          period_end: true,
        },
      });

    const approvedMap = {};

    for (const row of get_manager_approval_entries) {
      const key = `${dayjs(row.period_start).format("YYYY-MM-DD")}_${dayjs(
        row.period_end,
      ).format("YYYY-MM-DD")}`;
      console.log(row);

      approvedMap[key] = true;
    }

    const finalWeeklyData = weeklyData.map((week) => {
      const key = `${week.week_start}_${week.week_end}`;
      return {
        ...week,
        status: approvedMap[key] ? "APPROVED" : "PENDING",
      };
    });

    return res.status(200).json({
      success: true,
      message: "Successfully fetched weekly KPI data",
      data: finalWeeklyData,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch weekly KPI data for manager",
    });
  }
};

// api endpoint - /api/automation/update_daily_entries
// desc - Updates daily KPI entries for the user. Strict update (entries must exist). Checks approval status.
// Required payload from frontend
// {
//   "entry_date": "2026-01-14",
//   "kpis": [
//     { "kpi_id": 38, "value": 80 },
//     { "kpi_id": 41, "value": 10 }
//   ]
// }
const update_daily_entries = async (req, res) => {
  try {
    const employee_id = req.user.id;
    const { entry_date, kpis } = req.body;

    // 1️⃣ Validate request body
    if (!entry_date || !Array.isArray(kpis) || kpis.length === 0) {
      return res.status(400).json({
        message: "entry_date and kpis are required",
        success: false,
      });
    }

    // 2️⃣ Date parsing
    const [year, month, day] = entry_date.split("-").map(Number);
    const entryDate = new Date(Date.UTC(year, month - 1, day));

    if (isNaN(entryDate.getTime())) {
      return res.status(400).json({
        message: "Invalid entry_date format. Use YYYY-MM-DD",
        success: false,
      });
    }

    // 3️⃣ Approval Check: Ensure date is NOT in an APPROVED period
    const isApproved = await prisma.manager_kpi_approvals.findFirst({
      where: {
        employee_id,
        approval_status: "APPROVED",
        period_start: { lte: entryDate },
        period_end: { gte: entryDate },
      },
    });

    if (isApproved) {
      return res.status(403).json({
        message: "Cannot update entries in an approved period.",
        success: false,
      });
    }

    // 4️⃣ Strict Update Transaction
    // usage of prisma.update ensures we only modify existing records
    const operations = kpis.map((k) =>
      prisma.employee_daily_kpi_entries.update({
        where: {
          employee_id_kpi_id_entry_date: {
            employee_id,
            kpi_id: k.kpi_id,
            entry_date: entryDate,
          },
        },
        data: {
          value: k.value,
        },
      }),
    );

    await prisma.$transaction(operations);

    return res.status(200).json({
      message: "Daily KPI updated successfully",
      success: true,
    });
  } catch (error) {
    // Handle "Record not found" from prisma.update
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "One or more KPI entries not found for update",
        success: false,
      });
    }

    console.error("Update Daily KPI Error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
/**
 * @route   POST /api/automation/approve_weekly_entries
 * @desc    Approve the weekly kpi entries and store the data in kpi tables
 * @access  Private (Manager/Admin)
 */
// Postman Payload
// {
//     "emp_id": 1,
//     "period_start": "2026-01-12",
//     "period_end": "2026-01-18"
// }
const approve_weekly_entries = async (req, res) => {
  try {
    const manager_id = req.user.id;

    const { emp_id, period_start, period_end } = req.body;
    if (!emp_id || !period_start || !period_end) {
      return res.status(400).json({
        message: "Employee Id, Week Start Date and Week End Date is Required ",
        success: false,
      });
    }
    const startDate = new Date(period_start);
    const endDate = new Date(period_end);
    const check_approved_status = await prisma.manager_kpi_approvals.findFirst({
      where: {
        employee_id: Number(emp_id),
        period_start: startDate,
        period_end: endDate,
      },
    });

    // if (check_approved_status) {
    //   return res.status(400).json({
    //     message: "Week Is already Approved",
    //     success: false
    //   })
    // }
    const create_approval = await prisma.manager_kpi_approvals.create({
      data: {
        employee_id: Number(emp_id),
        period_start: startDate,
        period_end: endDate,
        manager_id,
        approval_status: "APPROVED",
      },
    });
    const get_weekly_entries = await prisma.employee_daily_kpi_entries.findMany(
      {
        where: {
          employee_id: Number(emp_id),
          entry_date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          entry_date: true,
          value: true,
          kpis: {
            select: {
              id: true,
              title: true,
              frequency_id: true,
            },
          },
          employees: {
            select: {
              id: true,
            },
          },
        },
      },
    );

    const aggregateByKpi = (entries) => {
      const map = new Map();

      for (const item of entries) {
        const kpiId = item.kpis.id;

        if (!map.has(kpiId)) {
          // first time KPI appears
          map.set(kpiId, {
            entry_date: item.entry_date, // keep first date (or remove if not needed)
            total_value: Number(item.value),
            kpis: item.kpis,
            employees: item.employees,
          });
        } else {
          // aggregate value
          map.get(kpiId).total_value += item.value;
        }
      }

      return Array.from(map.values());
    };
    const uniqueEntries = aggregateByKpi(get_weekly_entries);

    const cleardata = uniqueEntries.map((item) => {
      return {
        year: item.entry_date.getFullYear(),
        month: getMonthName(item.entry_date),
        frequency_id: 2,
        kpi_id: item.kpis.id,
        employee_id: item.employees.id,
        value_achieved: item.total_value,
      };
    });
    // 1️⃣ Find existing periods
    const periodsResult = await Promise.all(
      cleardata.map((item) =>
        prisma.kpi_periods.findMany({
          where: {
            year: item.year,
            month: item.month, // KEEP CONSISTENT
            frequency_id: item.frequency_id,
          },
        }),
      ),
    );

    // 2️⃣ Flatten result
    const existingPeriods = periodsResult.flat();

    let period_ids = [];

    if (existingPeriods.length > 0) {
      period_ids = existingPeriods.map((p) => p.id);
    } else {
      const createdPeriods = await Promise.all(
        cleardata.map((item) =>
          prisma.kpi_periods.create({
            data: {
              frequency_id: item.frequency_id,
              year: item.year,
              month: item.month,
            },
          }),
        ),
      );
      period_ids = createdPeriods.map((p) => p.id);
    }

    await Promise.all(
      cleardata.map(async (item, index) => {
        const existing = await prisma.kpi_values.findFirst({
          where: {
            kpi_id: item.kpi_id,
            employee_id: item.employee_id,
            period_id: period_ids[index],
          },
        });
        console.log(existing);

        if (existing) {
          // UPDATE
          return prisma.kpi_values.updateMany({
            where: { id: existing.id },
            data: {
              value_achieved: Number(existing.value_achieved) + Number(item.value_achieved),
            },
          });
        } else {
          // CREATE
          return prisma.kpi_values.create({
            data: {
              value_achieved: Number(item.value_achieved),
              employee_id: item.employee_id,
              kpi_id: item.kpi_id,
              period_id: period_ids[index],
            },
          });
        }
      }),
    );

    return res.status(200).json({
      message: "Weekly KPI entries approved successfully",
      success: true,
      data: uniqueEntries,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  daily_entries,
  get_daily_entries,
  get_weekly_entries_for_manager,
  update_daily_entries,
  approve_weekly_entries,
};
