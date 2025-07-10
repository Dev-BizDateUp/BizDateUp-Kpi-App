const prisma = require("../prisma/prismaClient.js");
const { getColor } = require("../utils.js");

async function getKPIs(req, res) {
  try {
    const kpis = await prisma.kpis.findMany();
    return res.json(kpis);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch KPIs" });
  }
}
async function getAllValueForKPIForEmp(req, res) {
  try {
    const kpi_id = parseInt(req.params.kpi_id);
    const emp_id = parseInt(req.params.emp_id);
    const kpi = await prisma.kpis.findFirst({ where: { id: kpi_id } });
    const target = kpi.target ?? 1;
    let rows = await prisma.kpi_values.findMany({
      where: {
        kpi_id: kpi_id,
        employee_id: emp_id,
      },
      include: {
        kpi_periods: true,
      },
    });
    for (let i = 0; i < rows.length; i++) {
      if (kpi.yellow_threshold != null) {
        rows[i].color = getColor(
          target,
          rows[i].value_achieved,
          kpi.yellow_threshold,
          kpi.green_threshold
        );
      }
    }

    return res.status(200).json({ data: rows });
  } catch (exc) {
    console.log("Could not get kpi values of kpi for employee", exc);
  }
}
async function getAllValueForKPI(req, res) {
  try {
    const kpi_id = parseInt(req.params.kpi_id);
    const kpi = await prisma.kpis.findFirst({ where: { id: kpi_id } });
    const target = kpi.target ?? 1; // Default to 1 to avoid division by zero
    let response = await prisma.kpi_values.findMany({
      where: { kpi_id: kpi_id },
    });
    let avg = 0;
    for (let i = 0; i < response.length; i++) {
      avg += response[i].value_achieved;
    }
    avg = avg / response.length;
    for (let i = 0; i < response.length; i++) {
      response[i].percentage = (response[i].value_achieved / target) * 100;
      response[i].target = target;
      response[i].avg = avg;
      response[i].color = getColor(
        target,
        response[i].value_achieved,
        kpi.yellow_threshold,
        kpi.green_threshold
      );
    }
    return res.status(200).json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch KPI values" });
  }
}
async function getKPIS_Employee(req, res) {
  const emp_id = parseInt(req.params.emp_id);
  try {
    const desg = await prisma.employees.findFirst({
      where: {
        id: emp_id,
      },
    });
    // console.log("designation")
    // console.log(desg);

    const kpis = await prisma.kpis.findMany({
      where: {
        designation_id: desg.designation_id,
      },
    });
    // console.log("Kpis");
    // console.log(kpis);

    return res.status(200).json({ data: kpis });
  } catch (exc) {
    return res.status(500).json({
      error: "Server error while getting kpis for employee id " + emp_id,
    });
  }
}
async function getEmployeeKPIDataRow(req, res) {
  const emp_id = parseInt(req.params.emp_id);
  try {
    let data = await prisma.kpi_values.findMany({
      where: {
        employee_id: emp_id,
      },
    });

    const per = await prisma.kpi_periods.findMany();
    const kpis = await prisma.kpis.findMany();

    for (let i = 0; i < data.length; i++) {
      const fr = per.filter((p) => p.id == data[i].period_id)[0].frequency_id;
      switch (fr) {
        case 1:
          data[i].frequency = "Weekly";
          break;
        case 2:
          data[i].frequency = "Monthly";
          break;
        case 3:
          data[i].frequency = "Quarterly";
          break;
        case 4:
          data[i].frequency = "Yearly";
          break;

        default:
          break;
      }
      const k = kpis.filter((w) => w.id == data[i].kpi_id)[0];
      data[i].kpi_name = k.title;
      data[i].target = k.target;
    }

    return res.status(200).json({
      data: data,
    });
  } catch (exc) {
    console.log("Failed!");
    console.log(exc);
    return res.status(500).json({ error: "Failed to get rows of kpi values" });
  }
}
async function getEmployeeKPIData(req, res) {
  const emp_id = parseInt(req.params.emp_id);
  try {
    const data = await prisma.kpi_values.findMany({
      where: {
        employee_id: emp_id,
      },
    });
    // console.log({ data: data });
    return res.status(200).json({ data: data });
  } catch (exc) {}
}
async function getKPI_id(req, res) {
  // console.log(req.params)
  try {
    const kpis = await prisma.kpis.findFirst({
      where: { id: parseInt(req.params.kpi_id) },
    });
    if (kpis) return res.status(200).json(kpis);
    else
      return res.status(400).json({ error: "Could not find kpi of that id" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch KPI id" });
  }
}
async function getKPI_Desg(req, res) {
  try {
    const kpis = await prisma.kpis.findMany({
      where: { designation_id: parseInt(req.params.desg_id) },
    });
    return res.json(kpis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch KPI id" });
  }
}
async function deleteKPI_id(req, res) {
  // console.log(req.params)
  const kpiId = parseInt(req.params.kpi_id);
  try {
    const kpiValues = await prisma.kpi_values.findMany({
      where: {
        kpi_id: kpiId,
      },
    });
    if (kpiValues.length > 0) {
      return res.status(400).json({
        error:
          "Mulitple kpi values refer this kpi, to delete anyways, use api/kpi/id/{kpi_id}/force",
        values: kpiValues,
      });
    }
    const kpis = await prisma.kpis.delete({ where: { id: kpiId } });
    return res.json(kpis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch KPI id" });
  }
}

async function deleteKPI_idForce(req, res) {
  // console.log(req.params)
  try {
    const kpiId = parseInt(req.params.kpi_id);

    const kpiValues = await prisma.kpi_values.findMany({
      where: {
        kpi_id: kpiId,
      },
    });
    if (kpiValues.length > 0) {
      await prisma.kpi_values.deleteMany({
        where: {
          kpi_id: kpiId,
        },
      });
    }

    const kpis = await prisma.kpis.delete({
      where: { id: parseInt(req.params.kpi_id) },
    });
    return res.json(kpis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete KPI" });
  }
}
async function getFreqs(req, res) {
  try {
    const kpis = await prisma.kpi_frequencies.findMany();
    return res.json(kpis);
  } catch (error) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch KPI id" });
  }
}

async function createKPI(req, res) {
  const {
    title,
    description,
    frequency_id,
    target,
    yellow_threshold,
    green_threshold,
    designation_id,
    value_type,
  } = req.body;

  if (!title) return res.status(400).json({ error: "title field is null!" });
  if (!description)
    return res.status(400).json({ error: "description field is null!" });
  if (!frequency_id)
    return res.status(400).json({ error: "frequency_id field is null!" });
  if (!designation_id)
    return res.status(400).json({ error: "designation_id field is null!" });
  if (!value_type)
    return res.status(400).json({ error: "value_type field is null!" });

  try {
    const designation = await prisma.designations.findFirst({
      where: { id: designation_id },
    });

    if (!designation) {
      return res.status(400).json({ error: "Invalid designation id." });
    }

    const employees = await prisma.employees.findMany({
      where: { designation_id: designation_id },
    });
    const kpiValues = employees.map((emp) => ({
      employee_id: emp.id,      
      desg_id: designation_id,      
      kpi_target: target,     
    }));
    const add_kpiValues = await prisma.kpi_target.createMany({
      data: kpiValues,
    });
    const newKPI = await prisma.kpis.create({
      data: {
        title,
        description,
        kpi_frequencies: {
          connect: {
            id: frequency_id,
          },
        },
        target,
        yellow_threshold,
        green_threshold,
        designations: {
          connect: {
            id: designation_id,
          },
        },
      },
    });
    if (!newKPI) {
      return res.status(500).json({
        error: "Failed to create KPI",
      });
    }
    if (!add_kpiValues) {
      return res.status(500).json({
        error: "Failed to create KPI values for employees",
      });
    } else {
      return res.status(200).json({
        data: add_kpiValues,
      });
    }
  } catch (err) {
    console.error("Error creating kpi:", err);
    if (err.code === "P2002") {
      return res.status(409).json({
        error: "kpi ID already exists",
      });
    }
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function editKPI(req, res) {
  let {
    title,
    description,
    frequency_id,
    target,
    yellow_threshold,
    green_threshold,
    designation_id,
  } = req.body;

  const kpi_id = req.params.kpi_id;

  try {
    const existingKPI = await prisma.kpis.findUnique({
      where: { id: parseInt(kpi_id) },
    });

    if (!existingKPI) {
      return res.status(404).json({ error: "KPI not found." });
    }

    const updatedDesignationId = designation_id ?? existingKPI.designation_id;

    if (designation_id !== undefined && designation_id !== null) {
      const designation = await prisma.designations.findFirst({
        where: { id: designation_id },
      });

      if (!designation) {
        return res.status(400).json({ error: "Invalid designation ID." });
      }
    }

    console.log({
      title: title ?? "",
      description: description ?? "",
      frequency_id: frequency_id ?? "",
      target: target,
      yellow_threshold: yellow_threshold,
      green_threshold: green_threshold,
      designation_id: updatedDesignationId,
    });

    const updatedKPI = await prisma.kpis.update({
      where: { id: parseInt(kpi_id) },
      data: {
        title: title ?? existingKPI.title,
        description: description ?? existingKPI.description,
        frequency_id: frequency_id ?? existingKPI.frequency_id,
        target: target,
        yellow_threshold: yellow_threshold,
        green_threshold: green_threshold,
        designation_id: updatedDesignationId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "KPI updated successfully",
      data: updatedKPI,
    });
  } catch (err) {
    console.error("Error updating KPI:", err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

async function addKPIValue(req, res) {
  try {
    const { value_achieved, employee_id, period_id, kpi_id } = req.body;

    if (value_achieved == null) {
      return res.status(400).json({ error: "Value achieved is missing" });
    }
    if (kpi_id == null) {
      return res.status(400).json({ error: "KPI ID is missing" });
    }
    if (employee_id == null) {
      return res.status(400).json({ error: "Employee ID is missing" });
    }
    if (period_id == null) {
      return res.status(400).json({ error: "Period ID is missing" });
    }

    const id = (await prisma.kpi_values.count()) + 1;

    const [employee, period, kpi] = await Promise.all([
      prisma.employees.findUnique({ where: { id: employee_id } }),
      prisma.kpi_periods.findUnique({ where: { id: period_id } }),
      prisma.kpis.findUnique({ where: { id: kpi_id } }),
    ]);

    if (!employee) {
      return res.status(400).json({ error: "Employee does not exist" });
    }
    if (!period) {
      return res.status(400).json({ error: "KPI Period does not exist" });
    }
    if (!kpi) {
      return res.status(400).json({ error: "KPI does not exist" });
    }

    const response = await prisma.kpi_values.create({
      data: {
        id: id,
        value_achieved: value_achieved,
        employee_id: employee_id,
        period_id: period_id,
        kpi_id: kpi_id,
      },
    });

    return res.status(201).json({
      message: "Created kpi value entry",
      entry: response,
    });
  } catch (ex) {
    console.log(`Could not make kpi entry`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function addKPIPeriod(req, res) {
  try {
    const { frequency_id, year, month, week, quarter, start_date, end_date } =
      req.body;

    if (frequency_id == null) {
      return res
        .status(400)
        .json({ error: "frequency_id achieved is missing" });
    }
    if (year == null) {
      return res.status(400).json({ error: "year is missing" });
    }

    const start = new Date(start_date);
    if (start.getDay() != 1 && start.getMonth() != 4 && start.getDate() != 1) {
      return res.status(400).json({
        error: "The start date is neither a monday nor 1st April",
      });
    }

    const end = new Date(end_date);
    if (end.getDay() != 0 && end.getMonth() != 3 && end.getDate() != 31) {
      return res.status(400).json({
        error: "The end date is neither a sunday nor 31st March",
      });
    }

    if (start > end) {
      return res
        .status(400)
        .json({ error: "Start date cannot be after end date" });
    }

    // const id = await prisma.kpi_values.count() + 1;

    const [frequency] = await Promise.all([
      prisma.kpi_frequencies.findUnique({ where: { id: frequency_id } }),
    ]);

    if (!frequency) {
      return res.status(400).json({ error: "Frequency does not exist" });
    }

    const response = await prisma.kpi_periods.create({
      data: {
        kpi_frequencies: { connect: { id: frequency_id } },
        year: year,
        month: month,
        week: week,
        quarter: quarter,
        start_date: start_date,
        end_date: end_date,
      },
    });

    return res.status(201).json({
      message: "Created kpi value entry",
      entry: response,
    });
  } catch (ex) {
    console.log(`Could not make kpi period`);
    console.log(ex);
    return res
      .status(500)
      .json({ error: "Server error while making kpi periods" });
  }
}
async function addNewEntry(req, res) {
  try {
    const {
      year, // required, financial year, 2025 for 2025-2026
      month, // required, 1 for April to 12 for March
      employee_id,
      quarter,
      start_date,
      end_date,
      frequency_id, // required, 1 for weekly, 2 for monthly, 3 for quarterly, 4 for yearly
      value, // required
      kpi_id, //required
    } = req.body;

    if (year == null) {
      return res.status(400).json({
        error: "year must be mentioned",
      });
    }
    if (frequency_id == null) {
      return res.status(400).json({
        error:
          "kind must be mentioned,  1 for weekly, 2 for monthly, 3 for quarterly, 4 for yearly",
      });
    }
    if (value == null) {
      return res.status(400).json({
        error: "value must be mentioned",
      });
    }
    if (kpi_id == null) {
      return res.status(400).json({
        error: "kpi id must be mentioned",
      });
    }

    const periods = await prisma.kpi_periods.findMany({
      where: {
        frequency_id: frequency_id,
        year: year,
        month: month - 1,
        quarter: quarter,
        start_date: start_date,
        end_date: end_date,
      },
    });

    let period_id = 0;

    if (periods.length > 0) {
      period_id = periods[0].id;
    } else {
      const period = await prisma.kpi_periods.create({
        data: {
          kpi_frequencies: {
            connect: {
              id: frequency_id,
            },
          },
          year: year,
          month: month - 1,
          quarter: quarter,
          start_date: start_date,
          end_date: end_date,
        },
      });
      period_id = period.id;
    }

    const exists = await prisma.kpi_values.findMany({
      where: {
        kpi_id: kpi_id,
        employee_id: employee_id,
        period_id: period_id,
      },
    });

    if (exists.length > 0) {
      // console.log('An entry already exists! reject!')
      return res.status(400).json({
        error: "An entry alread exists for given kpi and time period",
      });
    }
    // console.log(periods);
    const entry = await prisma.kpi_values.create({
      data: {
        value_achieved: value,
        employees: {
          connect: {
            id: employee_id,
          },
        },
        kpis: {
          connect: {
            id: kpi_id,
          },
        },
        kpi_periods: {
          connect: {
            id: period_id,
          },
        },
      },
    });
    return res.status(200).json({ data: entry });
    // return res.status(200).json({});
  } catch (exc) {
    console.log(`Could not add new entry for kpi value`);
    console.log(exc);
    return res
      .status(500)
      .json({ error: "Server error while adding new entry for kpi value" });
  }
  // const v = { year: 2025, month: 1, employee_id: 5, quarter: null, start_date: "2025-04-13T18:30:00.000Z", end_date: "2025-04-19T18:30:00.000Z", frequency_id: 1, value: true, kpi_id: 14 }
}

async function editKPIPeriod(req, res) {
  try {
    const { frequency_id, year, month, week, quarter } = req.body;

    const id = parseInt(req.params.id);

    if (frequency_id == null) {
      return res.status(400).json({ error: "frequency id is missing" });
    }
    if (year == null) {
      return res.status(400).json({ error: "year is missing" });
    }

    const [period, frequency] = await Promise.all([
      prisma.kpi_periods.findUnique({ where: { id: id } }),
      prisma.kpi_frequencies.findUnique({ where: { id: frequency_id } }),
    ]);

    if (!period) {
      return res.status(400).json({ error: "Period does not exist" });
    }

    if (!frequency) {
      return res.status(400).json({ error: "Employee does not exist" });
    }

    const response = await prisma.kpi_periods.update({
      where: { id: id },
      data: {
        kpi_frequencies: { connect: { id: frequency_id } },
        year: year,
        month: month,
        week: week,
        quarter: quarter,
      },
    });

    return res.status(201).json({
      message: "Created kpi value entry",
      entry: response,
    });
  } catch (ex) {
    console.log(`Could not make kpi entry`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function deleteKPIPeriod(req, res) {
  try {
    const id = parseInt(req.params.id);
    const exist = await prisma.kpi_periods.findFirst({
      where: {
        id: id,
      },
    });
    if (!exist) {
      return res
        .status(404)
        .json({ error: "Could not find kpi entry with that id" });
    }
    const ref = await prisma.kpi_values.findMany({
      where: {
        period_id: id,
      },
    });
    if (ref.length > 0) {
      return res.status(400).json({
        error:
          "One or many kpi values refer to this kpi period, cannot delete. if you want to delete anyways, delete at api/kpi/period/id/{id}/force",
        kpi_values: ref,
      });
    }
    const response = await prisma.kpi_periods.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Deleted kpi value" });
  } catch (ex) {
    console.log(`Could not delete kpi entry`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function deleteKPIPeriodForce(req, res) {
  try {
    const id = parseInt(req.params.id);
    const exist = await prisma.kpi_periods.findFirst({
      where: {
        id: id,
      },
    });
    if (!exist) {
      return res
        .status(404)
        .json({ error: "Could not find kpi entry with that id" });
    }
    const ref = await prisma.kpi_values.findMany({
      where: {
        period_id: id,
      },
    });
    if (ref.length > 0) {
      await prisma.kpi_values.deleteMany({
        where: {
          period_id: id,
        },
      });
    }
    const response = await prisma.kpi_periods.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Deleted kpi value" });
  } catch (ex) {
    console.log(`Could not delete kpi entry`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function getKPIPeriod(req, res) {
  try {
    const id = req.params.id;
    const exist = await prisma.kpi_periods.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!exist) {
      return res
        .status(404)
        .json({ error: "Could not find kpi entry with that id" });
    }
    return res.status(200).json({ message: "found kpi period", data: exist });
  } catch (ex) {
    console.log(`Could not get kpi period`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function getAllPeriods(req, res) {
  try {
    const response = await prisma.kpi_periods.findMany();
    return res.status(200).json({ message: "found kpis", data: response });
  } catch (ex) {
    console.log(`Could not kpi periods`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function editKPIValue(req, res) {
  try {
    const {
      value_achieved,
      frequency_id,
      year,
      month,
      quarter,
      start_date,
      end_date,
    } = req.body;

    const id = req.params.id;
    const exist = await prisma.kpi_values.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!exist) {
      return res
        .status(404)
        .json({ error: "Could not find kpi entry with that id" });
    }

    let period = await prisma.kpi_periods.findFirst({
      where: {
        frequency_id: frequency_id,
        year: year,
        month: month,
        quarter: quarter,
        start_date: start_date,
        end_date: end_date,
      },
    });

    if (period == null) {
      period = await prisma.kpi_periods.create({
        data: {
          frequency_id: frequency_id,
          year: year,
          month: month,
          quarter: quarter,
          start_date: start_date,
          end_date: end_date,
        },
      });
    }

    const response = await prisma.kpi_values.update({
      where: {
        id: parseInt(id),
      },
      data: {
        value_achieved: value_achieved,
        period_id: period.id,
      },
    });

    return res.status(201).json({
      message: "editted kpi value entry",
      entry: response,
    });
  } catch (ex) {
    console.log(`Could not edit kpi entry`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function deleteKPIValue(req, res) {
  try {
    const id = req.params.id;
    const exist = await prisma.kpi_values.findFirst({
      where: {
        id: parseInt(id),
      },
    });
    if (!exist) {
      return res
        .status(404)
        .json({ error: "Could not find kpi entry with that id" });
    }
    const response = await prisma.kpi_values.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({ message: "Deleted kpi value" });
  } catch (ex) {
    console.log(`Could not delete kpi entry`);
    console.log(ex);
    return res.status(500).json({});
  }
}

async function getKPIValue(req, res) {
  try {
    const { id } = req.params;
    let kpiValue = await prisma.kpi_values.findFirst({
      where: {
        id: parseInt(id),
      },
    });

    const kpi = await prisma.kpis.findFirst({
      where: {
        id: kpiValue.kpi_id,
      },
    });
    const percentage = (kpiValue.value_achieved / kpi.target) * 100;
    kpiValue.percentage = percentage;
    kpiValue.kpi = kpi;
    if (kpiValue) {
      return res.status(200).json({
        message: "found",
        data: kpiValue,
      });
    } else {
      return res
        .status(404)
        .json({ error: "Could not find any kpi entry with that id" });
    }
  } catch (ex) {
    console.log(`Could not get id value: \n${JSON.stringify(ex)}`);
    return res.status(500).json({ error: "Server failure!" });
  }
}

async function getKPIValueForKPI(req, res) {
  try {
    const { kpi_id } = req.params;
    const response = await prisma.kpi_values.findMany({
      where: {
        kpi_id: parseInt(kpi_id),
      },
    });
    if (response) {
      return res.status(200).json({
        message: "found",
        data: response,
      });
    } else {
      return res
        .status(404)
        .json({ error: "Could not find any kpi entry with that id" });
    }
  } catch (ex) {
    console.log(`Could not get kpi value: \n${JSON.stringify(ex)}`);
    return res.status(500).json({ error: "Server failure!" });
  }
}
const edit_per_employee_kpi_value = async (req, res) => {
  const { emp_id, kpi_target } = req.body;
  console.log("emp_id", emp_id);

  try {
    if (!emp_id) {
      return res.status(400).json({ error: "Employee ID is required" });
    } else {
      const update_kpi_value = await prisma.kpi_target.updateMany({
        where: { emp_id: emp_id },
        data: {
          kpi_target: kpi_target,
        },
      });
      if (!update_kpi_value) {
        return res.status(404).json({ error: "KPI Value Not Updated" });
      } else {
        return res.status(200).json({
          message: "KPI Value Updated Successfully",
          data: update_kpi_value,
        });
      }
    }
  } catch (err) {
    console.error("Error updating KPI value:", err);
    return res.status(500).json({ error: "Error From Catch Block" });
  }
};

module.exports = {
  createKPI,
  getKPIs,
  getFreqs,
  getKPI_id,
  editKPI,
  addKPIValue,
  getKPIValue,
  getKPIValueForKPI,
  editKPIValue,
  deleteKPIValue,
  addKPIPeriod,
  editKPIPeriod,
  deleteKPIPeriod,
  deleteKPIPeriodForce,
  getKPIPeriod,
  getAllPeriods,
  deleteKPI_id,
  deleteKPI_idForce,
  getKPI_Desg,
  addNewEntry,
  getEmployeeKPIData,
  getEmployeeKPIDataRow,
  getKPIS_Employee,
  getAllValueForKPI,
  getAllValueForKPIForEmp,
  edit_per_employee_kpi_value,
};
