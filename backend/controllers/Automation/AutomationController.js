const prisma = require("../../prisma/prismaClient.js");
const dayjs = require("dayjs");
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
    const kpi = await prisma.kpis.findMany({
      where: {
        id: {
          in: kpis.kpi_id,
        },
      },
    });
    if (!kpi) {
      return res.status(400).json({ message: "Invalid KPI" });
    }

    // 2️⃣ Date validation (today or last 2 days)
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

    if (diffDays < 0 || diffDays > 2) {
      return res.status(400).json({
        message: "You can fill KPI only for today or last 2 days",
      });
    }
    const operations = kpis.map((k) =>
      prisma.employee_daily_kpi_entries.upsert({
        where: {
          employee_id_kpi_id_entry_date: {
            employee_id,
            kpi_id: k.kpi_id,
            entry_date: entryDate,
          },
        },
        update: {
          value: k.value,
          updated_at: new Date(),
        },
        create: {
          employee_id,
          kpi_id: k.kpi_id,
          entry_date: entryDate,
          value: k.value,
        },
      })
    );
    await prisma.$transaction(operations);

    return res.status(200).json({
      message: "Daily KPI saved successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
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

// const get_weekly_entries_for_manager = async (req, res) => {
//   try {
//     const { employee_id } = req.params;

//     // 1️⃣ Fetch all daily KPI entries for the employee
//     const dailyEntries = await prisma.employee_daily_kpi_entries.findMany({
//       where: {
//         employee_id: Number(employee_id),
//       },
//       orderBy: {
//         entry_date: "asc",
//       },
//     });
//     // 2️⃣ Fetch approved weeks (to mark status later)
//     const approvedWeeks = await prisma.manager_kpi_approvals.findMany({
//       where: {
//         employee_id: Number(employee_id),
//         approval_status: "APPROVED",
//       },
//       select: {
//         period_start: true,
//         period_end: true,
//       },
//     });

//     // 3️⃣ Group daily entries into weeks
//     const weekMap = {};

//     for (const entry of dailyEntries) {
//       const date = new Date(entry.entry_date);

//       // ---- WEEK CALCULATION (Monday to Sunday) ----
//       const day = date.getDay() === 0 ? 7 : date.getDay(); // Sunday fix
//       const weekStart = new Date(date);
//       weekStart.setDate(date.getDate() - day + 1);
//       weekStart.setHours(0, 0, 0, 0);

//       const weekEnd = new Date(weekStart);
//       weekEnd.setDate(weekStart.getDate() + 6);

//       const key = weekStart.toISOString().slice(0, 10);

//       if (!weekMap[key]) {
//         weekMap[key] = {
//           employee_id: Number(employee_id),
//           period_start: weekStart,
//           period_end: weekEnd,
//           status: "PENDING",
//           entries: [],
//         };
//       }

//       weekMap[key].entries.push({
//         entry_date: entry.entry_date,
//         kpi_id: entry.kpi_id,
//         value: entry.value,
//       });
//     }

//     // 4️⃣ Mark approved weeks
//     for (const week of Object.values(weekMap)) {
//       const isApproved = approvedWeeks.some(
//         (ap) =>
//           week.period_start.getTime() === ap.period_start.getTime() &&
//           week.period_end.getTime() === ap.period_end.getTime()
//       );

//       if (isApproved) {
//         week.status = "APPROVED";
//       }
//     }

//     // 5️⃣ Send structured weekly data
//     return res.status(200).json({
//       success: true,
//       message: "Weekly KPI data for manager dashboard",
//       data: Object.values(weekMap),
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch weekly KPI data",
//     });
//   }
// };
// api end point - /get_weekly_entries_for_manager/emp_id/month/year

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

      const weekStart = entryDate.clone().date(weekStartDay).format("YYYY-MM-DD");
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
        row.period_end
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



module.exports = {
  daily_entries,
  get_daily_entries,
  get_weekly_entries_for_manager,
};
