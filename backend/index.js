const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const createmployeeroute = require("../backend/routes/createmployeeroute.js");
const createdepartmentsroute = require("../backend/routes/createdepartmentsroute.js");
const createdesignationroute = require("../backend/routes/createdesignationroute.js");
const kpiRoute = require('./routes/kpiRoutes.js');
const employeeRoute = require('./routes/employeeRoutes.js')
const desigRoutes = require('./routes/designationRoutes.js');
const deptRoutes = require('./routes/departmentRoutes.js')
const homeRoute = require('./routes/home.js')
const graphingRoutes = require('./routes/graphRoutes.js');

const Result = require('./Result')

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// Employee APi
app.use('/', homeRoute);
app.use("/api", createmployeeroute);
app.use("/api/get", createmployeeroute);
app.use("/api/patch", createmployeeroute);
// Departments Api
app.use("/api/get", createdepartmentsroute);
app.use("/api", createdepartmentsroute);
app.use("/api/get", createdepartmentsroute);

// Designation API
app.use("/api/get", createdesignationroute);
app.use("/api/post", createdesignationroute);
app.use("/api/get", createdesignationroute);

//kpis
app.use('/api/kpi', kpiRoute);
app.use('/api/designation', desigRoutes);
app.use('/api/employee', employeeRoute)
app.use('/api/department', deptRoutes)

//grapphs
app.use('/api/graph', graphingRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// let r = new Result(null,84739);
// r.failure(e => console.log(`Error! ${e}`)).success(s => console.log(`Success! ${s}`))