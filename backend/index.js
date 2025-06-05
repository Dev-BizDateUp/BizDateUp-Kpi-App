const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const createmployeeroute = require("../backend/routes/createmployeeroute.js");
const createdepartmentsroute = require("../backend/routes/createdepartmentsroute.js");
const createdesignationroute = require("../backend/routes/createdesignationroute.js");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Employee APi
app.use("/api", createmployeeroute);
app.use("/api/get", createmployeeroute);
app.use("/api/patch", createmployeeroute);
app.use("/api/patch", createmployeeroute);
// Departments Api
app.use("/api/get", createdepartmentsroute);
app.use("/api", createdepartmentsroute);
app.use("/api/get", createdepartmentsroute);

// Designation API
app.use("/api/get", createdesignationroute);
app.use("/api/post", createdesignationroute);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});