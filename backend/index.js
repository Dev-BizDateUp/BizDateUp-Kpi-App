const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const createmployeeroute = require("../backend/routes/createmployeeroute.js")
const createdepartmentsroute = require("../backend/routes/createdepartmentsroute.js")
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); 
app.use("/api", createmployeeroute)
app.use("/api", createdepartmentsroute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
