import prisma from "../../backend/prisma/prismaClient.js";
import { getISTMonthRange } from "../controllers/Badges/CreateBadgeController.js";
// const nodemailer = require('nodemailer');
// const { PrismaClient } = require('@prisma/client');
import dotenv from 'dotenv'
dotenv.config();


const fetchbadgescount = async (req, res) => {
    try {
        const { gte, lt } = getISTMonthRange();
        const badgeCounts = await prisma.badges.groupBy({
            by: ["giver_id"],
            where: {
                created_at: { gte, lt },
            },
            _count: {
                id: true,
            },
            having: {
                id: {
                    _count: {
                        gte: 3,
                    },
                },
            },
        });
        console.log(badgeCounts);

    }
    catch (e) {

    }
}
console.log("Heelo");

fetchbadgescount()