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

async function createKPI(req, res) {
    const {
        title,
        description,
        frequency_id,
        target,
        threshold_red_min,
        threshold_red_max,
        threshold_amber_min,
        threshold_amber_max,
        threshold_green_min,
        threshold_green_max,
        designation_id,
    } = req.body;

    if (!title) return res.status(400).json({ error: "title field is null!" });
    if (!description) return res.status(400).json({ error: "description field is null!" });
    if (!frequency_id) return res.status(400).json({ error: "frequency_id field is null!" });
    if (target === undefined || target === null) return res.status(400).json({ error: "target field is null!" });

    if (threshold_red_min === undefined || threshold_red_min === null)
        return res.status(400).json({ error: "threshold_red_min field is null!" });

    if (threshold_red_max === undefined || threshold_red_max === null)
        return res.status(400).json({ error: "threshold_red_max field is null!" });

    if (threshold_amber_min === undefined || threshold_amber_min === null)
        return res.status(400).json({ error: "threshold_amber_min field is null!" });

    if (threshold_amber_max === undefined || threshold_amber_max === null)
        return res.status(400).json({ error: "threshold_amber_max field is null!" });

    if (threshold_green_min === undefined || threshold_green_min === null)
        return res.status(400).json({ error: "threshold_green_min field is null!" });

    if (threshold_green_max === undefined || threshold_green_max === null)
        return res.status(400).json({ error: "threshold_green_max field is null!" });

    if (!designation_id) return res.status(400).json({ error: "designation_id field is null!" });

    try {
        const designation = await prisma.designations.findFirst({
            where: { id: designation_id },
        });

        if (!designation) {
            return res.status(400).json({ error: "Invalid designation name." });
        }


        const id = await prisma.kpis.count() + 1

        const newKPI = await prisma.kpis.create({
            data: {
                id,
                title,
                description,
                frequency_id,
                target,
                threshold_red_min,
                threshold_red_max,
                threshold_amber_min,
                threshold_amber_max,
                threshold_green_min,
                threshold_green_max,
                designation_id
            }
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
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

module.exports = {
    createKPI,
    getKPIs
}