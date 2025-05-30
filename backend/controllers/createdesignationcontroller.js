const pool = require("../config/db");
const validateDesignationInput = ({ name, department_id }) => {
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string.");
  }
  if (!department_id || isNaN(department_id)) {
    errors.push("Valid department_id is required.");
  }
  return errors;
};

// const createDesignationController = async (req, res) => {
//   const { name, department_id } = req.body;
//   const errors = validateDesignationInput({ name, department_id });
//   if (errors.length) {
//     return res.status(400).json({ errors });
//   }

//   try {
//     const { rowCount } = await pool.query(
//       "SELECT 1 FROM departments WHERE id = $1",
//       [department_id]
//     );
//     if (!rowCount) {
//       return res.status(400).json({ errors: ["Department not found."] });
//     }

//     const { rows } = await pool.query(
//       `INSERT INTO designations (name, department_id) VALUES ($1, $2) RETURNING *`,
//       [name.trim(), department_id]
//     );

//     return res.status(201).json({ data: rows[0], message: "Designation created successfully" });
//   } catch (error) {
//     console.error("createDesignation error:", error);
//     return res.status(500).json({ errors: ["Internal Server Error"] });
//   }
// };
const createDesignationController =async (req, res)=>{
  const {name, department_id} = req.body
 try{
   const result =  await pool.query("SELECT 1 from departments WHERE id= $1",[department_id])
   console.log(result);
   
      if (result.rowCount === 0) {
      return res.status(400).json({ error: "Department Not Found" });
    }
  if (!result) return res.status(400).json({error:"Department Not Found"})
    const data = await pool.query("INSERT into designations (name, department_id) VALUES ($1,$2) RETURNING *",
  [name, department_id])
  return res.status(201).json({
      message: "Designation created successfully",
      data: data.rows[0],
    });
 }
catch(err){
    if (err.code === "23505") {
      return res.status(409).json({ error: "Department already exists." });
    }
} 

}
module.exports = {
  createDesignationController,
};

createDesignationController