import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./Components/Login_Page/Login";
import Dashboard from "./Components/Dashboard/Dashboard";
import CreateKPI from "./Components/CreateKPI/CreateKPI";
import CreateKPIDept from "./Components/CreateKPI/CreateKPIDept";
import CreateKPIDesg from "./Components/CreateKPI/CreateKPIDesg";
import AddKPIData from "./Components/AddKPIData/AddKPIData";
import AddKPIDataDept from "./Components/AddKPIData/AddKPIDataDept";
import AddKPIDataDesg from "./Components/AddKPIData/AddKPIDataDesg";
import AddKPIDataEmp from "./Components/AddKPIData/AddKPIDataEmp";
import AddKPIDataKpi from "./Components/AddKPIData/AddKPIDataKpi";
import AddUser from "./Components/AddUser/AddUser";
import CreateDepartments from "./Components/CreateDepartments/CreateDepartments";
import CreateDesignation from "./Components/CreateDesignation/CreateDesignationBar";
import Top_Bar from "./Components/Top_Bar/Top_Bar";
import Navbar from "./Components/Navbar/Navbar";
import ManagerReview from "./Components/ManagerReview/ManagerReview";
import ManagerViewTable from "./Components/ManagerReview/ManagerViewTable.jsx";
import Designation from "./Components/CreateDesignation/Designation.jsx";
import Designation_Part from "./Components/Dashboard/Designation_Part.jsx";
import Department_Part from "./Components/Dashboard/Department_Part.jsx";
import Employee_Part from "./Components/Dashboard/Employee_Part.jsx";
import EmpManager from "./Components/Dashboard/EmpManager.jsx";
import { isTokenExpired } from "./utils.js";
import {
  AuthContext,
  GetterContext,
  SetterContext,
} from "./Components/Context/NewContext.jsx";
import {
  getAllKpis,
  getAllRoles,
  getDepartments,
  getDesignation,
  getEmployees,
} from "./Api/Endpoints/endpoints.js";
import { jwtDecode } from "jwt-decode";
import Home from "./Components/Home/Home.jsx";
import HomeKpi from "./Components/Home/HomeKpi.jsx";
import Appraisal from "./Components/Appraisal/Appraisal.jsx";
import Loader_Animation from "./Components/Loader_Animation/Loader_Animation.jsx";
import { getAllAppraisals } from "./Api/Endpoints/appraisalEndpoints.js";
import EmpAppraisal from "./Components/Dashboard/EmpAppraisal.jsx";
import Fake from "./Components/FakeLayer/Fake.jsx";
import Mobile_Navbar from "./Components/Navbar/Mobile_Navbar.jsx";
import BadgesMain from "./Components/Badges/BadgesMain.jsx";
import BadgesForm from "./Components/Badges/BadgesForm.jsx";
import BadgesHome from "./Components/Badges/BadgesHome.jsx";
import MyBadges from "./Components/Badges/MyBadges.jsx";
import BadgesLeadershipBoard from "./Components/Badges/BadgesLeadershipBoard.jsx";
import {
  get_all_badges_for_particular_emp,
  getallbadges,
  getEmployees_provided_badges,
  getinallbadges,
  getleadershipboardbadges,
} from "./Api/Endpoints/BadgesEndpoints.js/endpoint.js";
import GivenBadges from "./Components/Badges/GivenBadges.jsx";
import ReceivedBadges from "./Components/Badges/ReceivedBadges.jsx";
import AdminLeadershipBoard from "./Components/Badges/AdminLeadershipBoard.jsx";
import AdminApprovedBadges from "./Components/Badges/AdminApprovedBadges.jsx";
import AdminApprovalRemainingBadges from "./Components/Badges/AdminApprovalRemainingBadges.jsx";
import TimeModal from "./Components/TimeModal.jsx";
import ReviewForm from "./Components/ManagerReview/ReviewForm.jsx";
import QauterlyForm from "./Components/ManagerReview/QauterlyForm.jsx"
function App() {
  const location = useLocation();

  // ❗️ Replace this with real logic later (e.g., check token/localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Login page path
  const isLoginPage = location.pathname === "/login";

  // Show Topbar + Navbar only when authenticated
  const showLayout = isAuthenticated && !isLoginPage;

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [appraisals, setAppraisals] = useState(null);
  const [roles, setRoles] = useState([]);
  const [me, setMe] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [myRole, setMyRole] = useState(null);
  const [empbadges, setempbadges] = useState([]);
  const [empallbadges, setempallbadges] = useState([]);
  const [adminbadges, setadminbadges] = useState([]);
  const [getalladminbadges, setgetalladminbadges] = useState([]);
  const [leadershipboardbadges, setleadershipboardbadges] = useState([]);
  const managers = [
    "Meet",
    "Jyotir",
    "Yogesh",
    "Priyanka",
    "Aakash",
    "Khushi",
    "Siddharth",
  ];
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const MRActions = [
    {
      text: "No Action Required",
      value: "No Action Required",
    },
    {
      text: "Coaching/Mentoring",
      value: "Coaching/Mentoring",
    },
    {
      text: "Training required",
      value: "Training required",
    },
    {
      text: "Promotion Consideration",
      value: "Promotion Consideration",
    },
    {
      text: "Performance Improvement Plan (PIP)",
      value: "Performance Improvement Plan (PIP)",
    },
  ];
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState(null);
  function onLogin(tok, user) {
    console.log("thw token is ", tok);
    setIsAuthenticated(true);
    setToken(tok);
    localStorage.setItem("bizToken", tok);
    setUserData(user);
    location.pathname = "/";
    window.location.reload();
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("bizToken");
    if (storedToken) {
      if (!isTokenExpired(storedToken)) {
        const ud = jwtDecode(storedToken);
        setUserData(ud);
        setToken(storedToken);
        setIsAuthenticated(true);
        location.pathname = "/";
      } else {
        localStorage.removeItem("bizToken");
        setUserData(null);
        setToken("");
        setIsAuthenticated(false);
        location.pathname = "/login";
      }
    }

    getEmployees()
      .then((res) => {
        setEmployees(res.employees);
      })
      .catch((exc) => {
        console.error("Failed to fetch employees ", exc);
      });
    getDepartments()
      .then((res) => {
        setDepartments(res);
      })
      .catch((exc) => {
        console.error("Could not get context departments ", exc);
      });
    getDesignation()
      .then((res) => {
        setDesignations(res);
      })
      .catch((exc) => {
        console.error("Could not ftech context designations ", exc);
      });
    getAllRoles().then((res) => {
      if (res.result) {
        setRoles(res.result);
      } else if (res.error) {
        console.error("Could not get roles ", res.error);
      }
    });
    getAllKpis().then((res) => {
      if (res.result) {
        setKpis(res.result.data);
      }
    });
    getAllAppraisals().then((res) => {
      if (res.result) {
        setAppraisals(res.result.data);
      } else if (res.error) {
        console.error("Failed to get appraisals", res.error);
      }
    });
    getallbadges().then((res) => {
      if (res.result) {
        setadminbadges(res.result.data);
      } else if (res.error) {
        console.error("Failed To Fetch Admin Badges", res.error);
      }
    })
    getinallbadges().then((res) => {
      if (res.result) {
        setgetalladminbadges(res.result.data);
      } else if (res.error) {
        console.error("Failed To Fetch Admin Badges", res.error);
      }
    })
    getleadershipboardbadges().then((res) => {
      if (res.result) {
        setleadershipboardbadges(res.result.data);
      } else if (res.error) {
        console.error("Failed To Fetch Admin Badges", res.error);
      }
    })
  }, []);
  // console.log(leadershipboardbadges);

  useEffect(() => {
    setMyRole(employees.find((e) => e.id == userData.id)?.role);
    setMe(employees.find((e) => e.id == userData.id));
  }, [employees, userData, isAuthenticated, token]);

  useEffect(() => {
    getEmployees_provided_badges(userData?.id).then((res) => {
      if (res.result) {
        setempbadges(res.result);
        console.log("Employee Badges ", res.result);
      } else if (res.error) {
        console.error("Failed To Fetch Employee Badges", res.error);
      }
    });
    get_all_badges_for_particular_emp(userData?.id).then((res) => {
      if (res.result) {
        setempallbadges(res.result.data);
        console.log("All Badges ", res.result);
      } else if (res.error) {
        console.error("Failed To Fetch All Badges", res.error);
      }
    });
  }, [userData?.id]);

  return (
    <AuthContext.Provider value={{ token, userData }}>
      <SetterContext.Provider
        value={{
          setAppraisals,
          setDepartments,
          setEmployees,
          setDesignations,
          setRoles,
        }}
      >
        <GetterContext.Provider
          value={{
            MRActions,
            managers,
            appraisals,
            kpis,
            me,
            myRole,
            departments,
            designations,
            employees,
            roles,
            empbadges,
            empallbadges,
            userData,
            adminbadges,
            getalladminbadges,
            leadershipboardbadges
          }}
        >
          <div className="div">
            {/* Layout */}
            {showLayout && (
              <>
                {/* <Loader_Animation /> */}
                <div>
                  <Top_Bar toggleMenu={toggleMenu} />
                  <Navbar />

                  {isMenuOpen && <Mobile_Navbar toggleMenu={toggleMenu} />}
                </div>
              </>
            )}

            <Routes>
              <Route path="/fake" element={<Fake />} />

              {/* Login route (unprotected) */}
              <Route
                path="/login"
                element={
                  <Login isAuthenticated={isAuthenticated} onLogin={onLogin} />
                }
              />

              {/* Redirect root to dashboard */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <Navigate to="/home" replace />
                    </>
                  ) : (
                    <>
                      <Navigate to="/login" replace />
                    </>
                  )
                }
              />

              {/* Protected Routes */}
              {isAuthenticated ? (

                <>

                  {myRole && myRole.power > 50 && (
                    <>
                      <Route path="/add-user" element={<AddUser />} />
                      <Route
                        path="/create-departments"
                        element={<CreateDepartments />}
                      />
                      <Route
                        path="/create-designation"
                        element={<CreateDesignation />}
                      />
                      <Route path="/create-kpi" element={<CreateKPI />} />
                      <Route
                        path="/create-kpi/:dept_id"
                        element={<CreateKPIDept />}
                      />
                      <Route
                        path="/create-kpi/:dept_id/:desg_id"
                        element={<CreateKPIDesg />}
                      />
                      <Route path="/admin-approval" element={<AdminLeadershipBoard />}>
                        <Route index element={<AdminApprovedBadges />} />
                        <Route path="approval-remaining" element={<AdminApprovalRemainingBadges />} />
                      </Route>
                    </>
                  )}
                  {myRole && myRole.power > 19 && (
                    <>
                     <Route path="/manager" element={<ManagerViewTable />}>
  <Route path="monthly" element={<ReviewForm />} />
  <Route path="quarterly" element={<QauterlyForm />} />
  <Route path=":rev_id" element={<ManagerReview />} />
</Route>

                      {/* <Route path="/dashboard/test" element={<Loader_Animation />} /> */}

                      <Route path="/appraisal" element={<Appraisal />} />
                    </>
                  )}
                  {myRole && myRole.power >= 20 && (
                    <>
                      <Route path="/add-kpi-data" element={<AddKPIData />} />
                      <Route
                        path="/add-kpi-data/:dept_id"
                        element={<AddKPIDataDept />}
                      />
                      <Route
                        path="/add-kpi-data/:dept_id/:desg_id"
                        element={<AddKPIDataDesg />}
                      />
                      <Route
                        path="/add-kpi-data/:dept_id/:desg_id/:emp_id"
                        element={<AddKPIDataEmp />}
                      />
                      <Route
                        path="/add-kpi-data/:dept_id/:desg_id/:emp_id/:kpi_id"
                        element={<AddKPIDataKpi />}
                      />
                    </>
                  )}
                  <Route path="/appraisal" element={<Appraisal />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/dashboard/departments/:deptid"
                    element={<Department_Part />}
                  />
                  <Route
                    path="/dashboard/departments/:desname/emp"
                    element={<Designation_Part />}
                  />
                  <Route
                    path="/dashboard/departments/emp/:id"
                    element={<Employee_Part />}
                  />
                  <Route
                    path="/dashboard/departments/emp/:id/manager"
                    element={<EmpManager />}
                  />
                  <Route
                    path="/dashboard/departments/emp/:id/appraisal"
                    element={<EmpAppraisal />}
                  />

                  <Route path="/home" element={<Home />} />
                  {/* <Route path='/shine-badges' element={<BadgesMain />} />
                  <Route path='/shine-badges-give-badges' element={<BadgesForm />} />
                  <Route path='/shine-badges-home' element={<BadgesHome />} /> */}
                  {/* Shine Badges */}
                  <Route path="/shine-badges" element={<BadgesMain />}>
                    <Route index element={<BadgesHome />} />
                    <Route path="home" element={<BadgesHome />} />
                    <Route path="give" element={<BadgesForm />} />
                    <Route
                      path="leaderboard"
                      element={<BadgesLeadershipBoard />}
                    />
                    <Route path="my" element={<MyBadges />}>
                      <Route path="given" element={<GivenBadges />} />
                      <Route index element={<GivenBadges />} />
                      <Route path="received" element={<ReceivedBadges />} />
                    </Route>
                  </Route>

                  <Route path="/home/kpi/:kpi_id" element={<HomeKpi />} />

                </>
              ) : (
                // If not authenticated, redirect everything to login

                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
            {isModalOpen && (
              <TimeModal onClose={() => setIsModalOpen(false)} />
            )}
          </div>
        </GetterContext.Provider>
      </SetterContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
