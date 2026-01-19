const dotenv = require("dotenv")
const prisma = require("../prisma/prismaClient");
const { getISTMonthRange } = require("../controllers/Badges/CreateBadgeController");

dotenv.config();


const fetchbadgescount = async () => {
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
        if (badgeCounts) {
            return badgeCounts
        }
        else {
            console.log("Failure");

        }
    }
    catch (e) {
        console.log(e);

    }
}

console.log(fetchbadgescount());
