const prisma = require("../prisma/prismaClient");

function formatGroupedByKPI(values, freq_id) {
  const grouped = {};

  for (const val of values) {
    const kpi = val.kpis;

    if (!grouped[kpi.id]) {
      grouped[kpi.id] = {
        id: kpi.id,
        title: kpi.title,
        description: kpi.description,
        frequency_id: kpi.frequency_id,
        target: kpi.target,
        designation_id: kpi.designation_id,
        green_threshold: kpi.green_threshold,
        yellow_threshold: kpi.yellow_threshold,
        values: [],
      };
    }

    grouped[kpi.id].values.push({
      id: val.id,
      kpi_id: val.kpi_id,
      employee_id: val.employee_id,
      period_id: val.period_id,
      value_achieved: val.value_achieved,
      kpi_periods: val.kpi_periods,
      label:
        freq_id == 1 && val.kpi_periods?.start_date
          ? formatDateToDDMM(val.kpi_periods.start_date)
          : freq_id == 2 && val.kpi_periods?.month !== null
            ? getFinancialMonthName(val.kpi_periods.month)
            : undefined,
    });
  }

  return Object.values(grouped); // return as an array
}

function getFinancialMonthName(finMonth) {
  const months = [
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March",
  ];

  return months[finMonth] ?? `Month ${finMonth}`;
}

function formatDateToDDMM(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
  return `${day}/${month}`;
}

const getLineEmpWeek = async (req, res) => {
  const { emp_id, freq_id, start_date } = req.params;

  try {
    const parsedDate = new Date(start_date);

    const values = await prisma.kpi_values.findMany({
      where: {
        employee_id: parseInt(emp_id),
        kpi_periods: {
          frequency_id: parseInt(freq_id),
          start_date: parsedDate,
        },
      },
      include: {
        kpis: true,
        kpi_periods: true,
        kpi_target: true
      },
      orderBy: {
        kpi_periods: {
          start_date: "asc",
        },
      },
    });
    console.log(values);

    res.status(200).json({
      messgae: "Fetched",
      values: values
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLineEmpYr = async (req, res) => {
  const { emp_id, freq_id, year } = req.params;

  try {
    const values = await prisma.kpi_values.findMany({
      where: {
        employee_id: parseInt(emp_id),
        kpi_periods: {
          frequency_id: parseInt(freq_id),
          year: parseInt(year),
        },

      },
      include: {
        kpi_periods: true,
        kpis: true,
      },
      orderBy: {
        kpi_periods: {
          start_date: "asc",
        },
      },
    });

    const getdata = await prisma.kpi_target.findMany({
      where: {
        employee_id: parseInt(emp_id)
      }
    })

    
    res.json(formatGroupedByKPI(values, parseInt(freq_id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLineEmpYrQtr = async (req, res) => {
  const { emp_id, freq_id, year, quarter } = req.params;

  try {
    const values = await prisma.kpi_values.findMany({
      where: {
        employee_id: parseInt(emp_id),
        kpi_periods: {
          frequency_id: parseInt(freq_id),
          year: parseInt(year),
          quarter: parseInt(quarter),
        },
      },
      include: {
        kpi_periods: true,
        kpis: true,
      },
      orderBy: {
        kpi_periods: {
          start_date: "asc",
        },
      },
    });

    res.json(formatGroupedByKPI(values, parseInt(freq_id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getLineEmpYrMnt = async (req, res) => {
  const { emp_id, freq_id, year, month } = req.params;

  try {
    const values = await prisma.kpi_values.findMany({
      where: {
        employee_id: parseInt(emp_id),
        kpi_periods: {
          frequency_id: parseInt(freq_id),
          year: parseInt(year),
          month: parseInt(month),
        },
      },
      include: {
        kpi_periods: true,
        kpis: true,
        // kpi_target: true,
      },
      orderBy: {
        kpi_periods: {
          start_date: "asc",
        },
      },
    });
    //   const map = values.map((v) => {
    //    return v.kpi_target.map((item)=>{
    //    return item
    //     })
    // })
    // if (values) {
    //   return res.status(200).json({
    //     message: "KPI values retrieved successfully",
    //     values: values,
    //   })
    // }
    res.json(formatGroupedByKPI(values, parseInt(freq_id)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function allKpiEmp(req, res) {
  const emp_id = parseInt(req.params.emp_id);
  if (isNaN(emp_id)) {
    return res.status(400).json({ error: "Invalid employee ID" });
  }
  const emp = await prisma.employees.findUnique({
    where: { id: emp_id },
  });
  const kpis = await prisma.kpis.findMany({
    where: {
      designation_id: emp.designation_id,
    },
  });
  if (!kpis) {
    return res.status(404).json({ error: "No KPIs found for this employee" });
  }
  for (let i = 0; i < kpis.length; i++) {
    const k = kpis[i];
    const values = await prisma.kpi_values.findMany({
      where: { kpi_id: k.id, employee_id: emp_id },
      include: {
        kpi_periods: true,
      },
    });
    k.kpi_values = values;
  }

  return res.status(200).json(kpis);
}
async function pieGraph_desg_completion(req, res) {
  const desg_id = parseInt(req.params.desg_id);
  if (isNaN(desg_id)) {
    return res.status(400).json({ error: "Invalid designation ID" });
  }

  try {
    const kpis = await prisma.kpis.findMany({
      where: {
        designation_id: desg_id,
      },
      include: {
        kpi_values: {
          select: {
            value_achieved: true,
            kpi_periods: true,
          },
        },
      },
    });
    let comp = 0,
      total = 0;
    for (let i = 0; i < kpis.length; i++) {
      const k = kpis[i];
      for (let j = 0; j < k.kpi_values.length; j++) {
        const v = k.kpi_values[j];
        if (v.value_achieved >= k.target) {
          comp++;
        }
        total++;
      }
    }

    return res.status(200).json({
      completed: comp,
      total: total,
      percentage: total > 0 ? (comp / total) * 100 : 0,
    });
  } catch (exc) {
    console.error("Error in pieGraph_Desg:", exc);
    return res
      .status(500)
      .json({ error: "Internal server error when getting pie chart" });
  }
}

async function barGraph_kpi(req, res) {
  const kpi_id = parseInt(req.params.kpi_id);
  if (isNaN(kpi_id)) {
    return res.status(400).json({ error: "Invalid KPI ID" });
  }

  try {
    const kpi = await prisma.kpis.findUnique({
      where: { id: kpi_id },
      include: {
        kpi_values: {
          include: {
            kpi_periods: true,
          },
        },
      },
    });

    if (!kpi) {
      return res.status(404).json({ error: "KPI not found" });
    }

    // Map values with period info and sort by period (assuming period has a 'start_date' or similar)
    const values = kpi.kpi_values
      .map((v) => ({
        value_achieved: v.value_achieved,
        period: v.kpi_periods,
      }))
      .sort((a, b) => {
        // Replace 'start_date' with the actual field name for period sorting
        if (a.period.start_date != null && b.period.start_date != null) {
          return new Date(a.period.start_date) - new Date(b.period.start_date);
        }

        if (a.period.year != b.period.year) {
          return a.period.year - b.period.year;
        }
        if (a.period.quarter != null && b.period.quarter != null) {
          if (a.period.year != b.period.year) {
            return a.period.quarter - b.period.quarter;
          }
        }
        return a.period.month - b.period.month;
      });

    return res.status(200).json({ kpi_id, values });
  } catch (exc) {
    console.error("Error in barGraph_desg:", exc);
    return res
      .status(500)
      .json({ error: "Internal server error when getting KPI values" });
  }
}

module.exports = {
  pieGraph_desg_completion,
  barGraph_kpi,
  allKpiEmp,
  getLineEmpYrMnt,
  getLineEmpYr,
  getLineEmpYrQtr,
  getLineEmpWeek,
};
