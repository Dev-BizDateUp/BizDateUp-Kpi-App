const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const createmployeeroute = require("./routes/createmployeeroute.js");
const createdepartmentsroute = require("./routes/createdepartmentsroute.js");
const createdesignationroute = require("./routes/createdesignationroute.js");
const kpiRoute = require('./routes/kpiRoutes.js');
const employeeRoute = require('./routes/employeeRoutes.js')
const desigRoutes = require('./routes/designationRoutes.js');
const deptRoutes = require('./routes/departmentRoutes.js')
const homeRoute = require('./routes/home.js')
const graphingRoutes = require('./routes/graphRoutes.js');
const loginRoute = require('./routes/loginRoute.js');
const managerRoutes = require('./routes/managerRoutes.js')
const appraisalRoutes = require('./routes/appraisalRoutes.js')
const rolesRoutes = require('./routes/rolesRoutes.js')
const Result = require('./Result')
const authorize = require('./validateToken.js')
const cookieParser = require('cookie-parser');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // For application/x-www-form-urlencoded
// Employee APi
app.use('/', homeRoute);
app.use("/api", authorize, createmployeeroute);
app.use("/api/get", authorize, createmployeeroute);
app.use("/api/patch", authorize, createmployeeroute);
// Departments Api
app.use("/api/get", authorize, createdepartmentsroute);
app.use("/api", authorize, createdepartmentsroute);
app.use("/api/get", authorize, createdepartmentsroute);

app.use("/login/", loginRoute);

app.use('/api/manager/', authorize, managerRoutes)
app.use('/api/role/',authorize,rolesRoutes)
// Designation API
app.use("/api/get", authorize, createdesignationroute);
app.use("/api/post", authorize, createdesignationroute);
app.use("/api/get", authorize, createdesignationroute);

//kpis
app.use('/api/kpi', authorize, kpiRoute);
app.use('/api/designation', authorize, desigRoutes);
app.use('/api/employee', authorize, employeeRoute)
app.use('/api/department', authorize, deptRoutes);

app.use('/api/appraisal', authorize, appraisalRoutes);

//graphs
app.use('/api/graph', authorize, graphingRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

