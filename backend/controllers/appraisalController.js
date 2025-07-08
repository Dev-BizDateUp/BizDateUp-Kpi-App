const prisma = require("../prisma/prismaClient.js");
// Get all appraisals
const getAllAppraisals = async (req, res) => {
    try {
        const appraisals = await prisma.appraisal.findMany()
        res.status(200).json(appraisals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new appraisal
const createAppraisal = async (req, res) => {
    try {
        const {
            employee_id,
            start,
            end,
            manager_name,
            review_date,
            kpi_achieved_percentage,
            competency_name,
            competency_rating,
            competency_remarks,
            achievements = '',
            a_o_improve = '',
            overall_rating = 0,
            revised_ctc,
            new_designation_id,
            bonus,
            goals
        } = req.body;

        if (
            !employee_id ||
            !start ||
            !end ||
            !manager_name ||
            !review_date ||
            kpi_achieved_percentage === undefined ||
            !Array.isArray(competency_name) || competency_name.length === 0 ||
            !Array.isArray(competency_rating) || competency_rating.length === 0 ||
            !Array.isArray(competency_remarks) || competency_remarks.length === 0
        ) {
            if (!employee_id) {
                return res.status(400).json({ error: "employee_id is required" });
            }
            if (!start) {
                return res.status(400).json({ error: "start date is required" });
            }
            if (!end) {
                return res.status(400).json({ error: "end date is required" });
            }
            if (!manager_name) {
                return res.status(400).json({ error: "manager_name is required" });
            }
            if (!review_date) {
                return res.status(400).json({ error: "review_date is required" });
            }
            if (kpi_achieved_percentage === undefined) {
                return res.status(400).json({ error: "kpi_achieved_percentage is required" });
            }
            if (!Array.isArray(competency_name) || competency_name.length === 0) {
                return res.status(400).json({ error: "competency_name must be a non-empty array" });
            }
            if (!Array.isArray(competency_rating) || competency_rating.length === 0) {
                return res.status(400).json({ error: "competency_rating must be a non-empty array" });
            }
            if (!Array.isArray(competency_remarks) || competency_remarks.length === 0) {
                return res.status(400).json({ error: "competency_remarks must be a non-empty array" });
            }
        }

        if (new_designation_id != null) {
            const desg = await prisma.designations.findUnique({
                where: {
                    id: new_designation_id
                }
            });
            if (!desg) {
                return res.status(400).json({ error: "Appraisal designation doesnt exist!" });
            }
        }

        const appraisal = await prisma.appraisal.create({
            data: {
                //uncomment this comment this line if you are getting
                //unique value clash on creating new appraisal
                //id: Math.floor(Math.random() * 99999999),
                employees: {
                    connect: {
                        id: employee_id
                    }
                },
                start: new Date(start),
                end: new Date(end),
                manager_name,
                review_date: new Date(review_date),
                kpi_achieved_percentage,
                competency_name,
                competency_rating,
                competency_remarks,
                achievements,
                a_o_improve,
                overall_rating,
                revised_ctc,
                new_designation_id,
                bonus,
                goals
            }
        });
        res.status(201).json(appraisal);
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: error.message });
    }
};

// Edit an appraisal
const editAppraisal = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (req.body.id != undefined) {
            return res.status(400).json({
                error: "Cannot change id"
            });
        }
        if (req.body.start != undefined) {
            req.body.start = new Date(req.body.start);
        }
        if (req.body.end != undefined) {
            req.body.end = new Date(req.body.end);
        }
        if (req.body.review_date != undefined) {
            req.body.review_date = new Date(req.body.review_date);
        }
        if (req.body.employee_id != undefined) {
            return res.status(400).json({
                error: "Cannot change employee"
            });
        }
        const updatedAppraisal = await prisma.appraisal.update(
            {
                where: {
                    id: id
                },
                data: req.body
            }
        );
        if (!updatedAppraisal) {
            return res.status(404).json({ message: 'Appraisal not found' });
        }
        res.status(200).json(updatedAppraisal);
    } catch (error) {
        console.error(error)

        res.status(400).json({ message: error.message });
    }
};

// Get appraisal by ID
const getAppraisal_ID = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const appraisal = await prisma.appraisal.findUnique(
            {
                where: {
                    id: id
                }
            }
        );
        if (!appraisal) {
            return res.status(404).json({ message: 'Appraisal not found' });
        }
        res.status(200).json(appraisal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get appraisals by employee
const getAppraisal_Employee = async (req, res) => {
    try {
        const emp_id = parseInt(req.params.emp_id)
        const appraisals = await prisma.appraisal.findMany({
            where: {
                employee_id: emp_id
            }
        });
        res.status(200).json(appraisals);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllAppraisals,
    createAppraisal,
    editAppraisal,
    getAppraisal_ID,
    getAppraisal_Employee,
};