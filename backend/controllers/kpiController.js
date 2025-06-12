const prisma = require("../prisma/prismaClient.js");

async function getKPIs(req, res) {
    try {
        const kpis = await prisma.kpis.findMany();
        return res.json(kpis);
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch KPIs" });
    }
}
async function getKPI_id(req, res) {
    // console.log(req.params)
    try {
        const kpis = await prisma.kpis.findFirst({ where: { id: parseInt(req.params.kpi_id) } })
        return res.json(kpis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch KPI id" });
    }
}
async function getKPI_Desg(req,res){
    try {
        const kpis = await prisma.kpis.findMany({ where: { designation_id: parseInt(req.params.desg_id) } })
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
                kpi_id: kpiId
            }
        })
        if (kpiValues.length > 0) {
            return res.status(400).json({
                error: "Mulitple kpi values refer this kpi, to delete anyways, use api/kpi/id/{kpi_id}/force",
                values: kpiValues
            })
        }
        const kpis = await prisma.kpis.delete({ where: { id: kpiId } })
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
                kpi_id: kpiId
            }
        })
        if (kpiValues.length > 0) {
            await prisma.kpi_values.deleteMany({
                where: {
                    kpi_id: kpiId
                }
            })
        }

        const kpis = await prisma.kpis.delete({ where: { id: parseInt(req.params.kpi_id) } })
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
        value_type
    } = req.body;

    if (!title) return res.status(400).json({ error: "title field is null!" });
    if (!description) return res.status(400).json({ error: "description field is null!" });
    if (!frequency_id) return res.status(400).json({ error: "frequency_id field is null!" });
    // if (target === undefined || target === null) return res.status(400).json({ error: "target field is null!" });

    // if (yellow_threshold === undefined || yellow_threshold === null)
    //     return res.status(400).json({ error: "yellow_threshold field is null!" });

    // if (green_threshold === undefined || green_threshold === null)
    //     return res.status(400).json({ error: "green_threshold field is null!" });

    if (!designation_id) return res.status(400).json({ error: "designation_id field is null!" });
    if (!value_type) return res.status(400).json({ error: "value_type field is null!" });

    try {
        const designation = await prisma.designations.findFirst({
            where: { id: designation_id },
        });

        if (!designation) {
            return res.status(400).json({ error: "Invalid designation id." });
        }


        const id = await prisma.kpis.count() + 1

        const newKPI = await prisma.kpis.create({
            data: {
                // id,
                title,
                description,
                kpi_frequencies:{
                    connect:{
                        id:frequency_id
                    }
                },
                target,
                yellow_threshold,
                green_threshold,
                designations:{
                    connect:{
                        id:designation_id
                    }
                },
                // value_type
            }
        });

        return res.status(201).json({
            success: true,
            message: "KPI created successfully",
            data: newKPI,
        });
    }
    catch (err) {
        console.error("Error creating kpi:", err);

        // Handle duplicate employee_id or email
        if (err.code === "P2002") {
            return res.status(409).json({
                error: "kpi ID already exists",
            });
        }

        // Generic server error
        return res.status(500).json({
            error: "Internal server error",
        });
    }
}

async function editKPI(req, res) {
    const {
        title,
        description,
        frequency_id,
        target,
        yellow_threshold,
        green_threshold,
        designation_id
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

        const updatedKPI = await prisma.kpis.update({
            where: { id: parseInt(kpi_id) },
            data: {
                title: title ?? existingKPI.title,
                description: description ?? existingKPI.description,
                frequency_id: frequency_id ?? existingKPI.frequency_id,
                target: target ?? existingKPI.target,
                yellow_threshold: yellow_threshold ?? existingKPI.yellow_threshold,
                green_threshold: green_threshold ?? existingKPI.green_threshold,
                designation_id: updatedDesignationId,
            }
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
        const {
            value_achieved,
            employee_id,
            period_id,
            kpi_id
        } = req.body;

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

        const id = await prisma.kpi_values.count() + 1;



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
                kpi_id: kpi_id
            }
        });

        return res.status(201).json({
            message: "Created kpi value entry",
            entry: response
        });
    } catch (ex) {
        console.log(`Could not make kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }

}

async function addKPIPeriod(req, res) {
    try {
        const {
            frequency_id,
            year,
            month,
            week,
            quarter
        } = req.body;

        if (frequency_id == null) {
            return res.status(400).json({ error: "frequency_id achieved is missing" });
        }
        if (year == null) {
            return res.status(400).json({ error: "year is missing" });
        }

        const id = await prisma.kpi_values.count() + 1;

        const [frequency] = await Promise.all([
            prisma.kpi_frequencies.findUnique({ where: { id: frequency_id } }),
        ]);

        if (!frequency) {
            return res.status(400).json({ error: "Employee does not exist" });
        }

        const response = await prisma.kpi_periods.create({
            data: {
                kpi_frequencies: { connect: { id: frequency_id } },
                year: year,
                month: month,
                week: week,
                quarter: quarter
            }
        });

        return res.status(201).json({
            message: "Created kpi value entry",
            entry: response
        });
    } catch (ex) {
        console.log(`Could not make kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }

}

async function editKPIPeriod(req, res) {
    try {
        const {
            frequency_id,
            year,
            month,
            week,
            quarter
        } = req.body;

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
                quarter: quarter
            }
        });

        return res.status(201).json({
            message: "Created kpi value entry",
            entry: response
        });
    } catch (ex) {
        console.log(`Could not make kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }

}

async function deleteKPIPeriod(req, res) {
    try {
        const id = parseInt(req.params.id);
        const exist = await prisma.kpi_periods.findFirst({
            where: {
                id: (id)
            }
        })
        if (!exist) {
            return res.status(404).json({ error: "Could not find kpi entry with that id" });
        }
        const ref = await prisma.kpi_values.findMany({
            where: {
                period_id: id
            }
        })
        if (ref.length > 0) {
            return res.status(400).json({
                error: "One or many kpi values refer to this kpi period, cannot delete. if you want to delete anyways, delete at api/kpi/period/id/{id}/force",
                kpi_values: ref
            })
        }
        const response = await prisma.kpi_periods.delete(
            {
                where: {
                    id: parseInt(id)
                }
            }
        );
        return res.status(200).json({ message: "Deleted kpi value" })
    } catch (ex) {
        console.log(`Could not delete kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }
}

async function deleteKPIPeriodForce(req, res) {
    try {
        const id = parseInt(req.params.id);
        const exist = await prisma.kpi_periods.findFirst({
            where: {
                id: (id)
            }
        })
        if (!exist) {
            return res.status(404).json({ error: "Could not find kpi entry with that id" });
        }
        const ref = await prisma.kpi_values.findMany({
            where: {
                period_id: id
            }
        })
        if (ref.length > 0) {
            await prisma.kpi_values.deleteMany({
                where: {
                    period_id: id
                }
            });
        }
        const response = await prisma.kpi_periods.delete(
            {
                where: {
                    id: parseInt(id)
                }
            }
        );
        return res.status(200).json({ message: "Deleted kpi value" })
    } catch (ex) {
        console.log(`Could not delete kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }
}

async function getKPIPeriod(req, res) {
    try {
        const id = req.params.id;
        const exist = await prisma.kpi_periods.findFirst({
            where: {
                id: parseInt(id)
            }
        })
        if (!exist) {
            return res.status(404).json({ error: "Could not find kpi entry with that id" });
        }
        const response = await prisma.kpi_periods.findFirst(
            {
                where: {
                    id: parseInt(id)
                }
            }
        );
        return res.status(200).json({ message: "found kpi period", data: response })
    } catch (ex) {
        console.log(`Could not delete kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }
}

async function editKPIValue(req, res) {
    try {
        const {
            value_achieved,
            employee_id,
            period_id,
            kpi_id
        } = req.body;

        const id = req.params.id;
        const exist = await prisma.kpi_values.findFirst({
            where: {
                id: parseInt(id)
            }
        })
        if (!exist) {
            return res.status(404).json({ error: "Could not find kpi entry with that id" });
        }

        const [employee, period, kpi, kpiValue] = await Promise.all([
            prisma.employees.findUnique({ where: { id: employee_id } }),
            prisma.kpi_periods.findUnique({ where: { id: period_id } }),
            prisma.kpis.findUnique({ where: { id: kpi_id } }),
            prisma.kpi_values.findUnique({ where: { id: parseInt(id) } }),
        ]);

        if (!kpiValue) {
            return res.status(400).json({ error: "KPI does not exist" });
        }

        if (!employee) {
            return res.status(400).json({ error: "Employee does not exist" });
        }
        if (!period) {
            return res.status(400).json({ error: "KPI Period does not exist" });
        }
        if (!kpi) {
            return res.status(400).json({ error: "KPI does not exist" });
        }

        const response = await prisma.kpi_values.update({
            where: {
                id: parseInt(id)
            },
            data: {
                value_achieved: value_achieved ?? kpiValue.value_achieved,
                employee_id: employee_id ?? kpiValue.employee_id,
                period_id: period_id ?? kpiValue.period_id,
                kpi_id: kpi_id ?? kpiValue.kpi_id
            }
        });

        return res.status(201).json({
            message: "editted kpi value entry",
            entry: response
        });
    } catch (ex) {
        console.log(`Could not edit kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }

}

async function deleteKPIValue(req, res) {
    try {
        const id = req.params.id;
        const exist = await prisma.kpi_values.findFirst({
            where: {
                id: parseInt(id)
            }
        })
        if (!exist) {
            return res.status(404).json({ error: "Could not find kpi entry with that id" });
        }
        const response = await prisma.kpi_values.delete(
            {
                where: {
                    id: parseInt(id)
                }
            }
        );
        return res.status(200).json({ message: "Deleted kpi value" })
    } catch (ex) {
        console.log(`Could not delete kpi entry`)
        console.log(ex);
        return res.status(500).json({});
    }
}

async function getKPIValue(req, res) {
    try {
        const { id } = req.params;
        let kpiValue = await prisma.kpi_values.findFirst({
            where: {
                id: parseInt(id)
            }
        })

        const kpi = await prisma.kpis.findFirst({
            where: {
                id: kpiValue.kpi_id
            }
        })

        const green = (kpi.green_threshold - 1) * kpi.target / 100;
        const yellow = (kpi.yellow_threshold - 1) * kpi.target / 100;

        // console.log(`yellow: ${yellow} green: ${green} value:${kpiValue.value_achieved}`)
        // console.log(`in red? ${kpiValue.value_achieved <= yellow}`);
        // console.log(`in green? ${kpiValue.value_achieved >= green}`);
        // console.log(`in yellow? ${kpiValue.value_achieved < green && kpiValue.value_achieved > yellow}`);
        if (kpiValue.value_achieved <= yellow) {
            kpiValue.color = "red";
        }
        else if (kpiValue.value_achieved >= green) {
            kpiValue.color = 'green';
        } else {
            kpiValue.color = 'yellow';
        }

        if (kpiValue) {
            return res.status(200).json({
                message: "found",
                data: kpiValue
            })
        } else {
            return res.status(404).json({ error: "Could not find any kpi entry with that id" })
        }
    }
    catch (ex) {
        console.log(`Could not get id value: \n${JSON.stringify(ex)}`)
        return res.status(500).json({ error: "Server failure!" })
    }
}

async function getKPIValueForKPI(req, res) {
    try {
        const { kpi_id } = req.params;
        const response = await prisma.kpi_values.findMany({
            where: {
                kpi_id: parseInt(kpi_id)
            }
        })
        if (response) {
            return res.status(200).json({
                message: "found",
                data: response
            })
        } else {
            return res.status(404).json({ error: "Could not find any kpi entry with that id" })
        }
    }
    catch (ex) {
        console.log(`Could not get kpi value: \n${JSON.stringify(ex)}`)
        return res.status(500).json({ error: "Server failure!" })
    }
}

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
    deleteKPI_id,
    deleteKPI_idForce,
    getKPI_Desg
}