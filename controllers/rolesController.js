const prisma = require("../prisma/prismaClient.js");

async function getAllRoles(req, res) {
    try {
        const roles = await prisma.roles.findMany();
        return res.status(200).json(roles)
    } catch (exc) {
        console.error("Failed to fetch all roles ", exc)
        return res.status(500).json({ error: "failed to get all roles" })
    }
}
async function getRoleInfo(req, res) {
    try {
        const id = parseInt(req.params.id);
        if(id == NaN){
            return res.status(400).json({
                error:"id is not a number"
            })
        }else if(id == null || id == undefined){
            return res.status(400).json({
                error:'id is null or undefined'
            })
        }
        const role = await prisma.roles.findUnique({
            where:{
                id
            }
        })
        if(!role){
            return res.status(404).json({error:"Could not find role with that id"})
        }
        return res.status(200).json(role)
    } catch (exc) {
        
    }
}


module.exports = {
    getAllRoles,
    getRoleInfo
}