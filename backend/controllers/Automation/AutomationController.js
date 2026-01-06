const prisma = require("../../prisma/prismaClient.js");

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
    const get_entries = await prisma.employee_daily_kpi_entries.findMany({
      where: {
        employee_id: req.user.id,
      },
    });
    const manager_approval = await prisma.manager_kpi_approvals.findMany({
      where: {
        employee_id: req.user.id,
        approval_status: "APPROVED",
      },
    });
    const pendingEntries = get_entries.filter((entry) => {
      return !manager_approval.some((approval) => {
        return (
          entry.entry_date >= approval.period_start &&
          entry.entry_date <= approval.period_end
        );
      });
    });
    return res.status(200).json({
      message: "Fetched Indiviual KPI Entries",
      Success: true,
      data: pendingEntries,
    });
  } catch (e) {
    return res.status(500).json({
      message: "Failed In Fetching Indiviual KPI ",
      Success: false,
      error: e.message,
    });
  }
};

module.exports = {
  daily_entries,
  get_daily_entries,
};
