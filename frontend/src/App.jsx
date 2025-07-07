import './App.css';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';

import Login from './Components/Login_Page/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateKPI from './Components/CreateKPI/CreateKPI';
import CreateKPIDept from './Components/CreateKPI/CreateKPIDept';
import CreateKPIDesg from './Components/CreateKPI/CreateKPIDesg';
import AddKPIData from './Components/AddKPIData/AddKPIData';
import AddKPIDataDept from './Components/AddKPIData/AddKPIDataDept';
import AddKPIDataDesg from './Components/AddKPIData/AddKPIDataDesg';
import AddKPIDataEmp from './Components/AddKPIData/AddKPIDataEmp';
import AddKPIDataKpi from './Components/AddKPIData/AddKPIDataKpi';
import AddUser from './Components/AddUser/AddUser';
import CreateDepartments from './Components/CreateDepartments/CreateDepartments';
import CreateDesignation from './Components/CreateDesignation/CreateDesignationBar';
import Top_Bar from './Components/Top_Bar/Top_Bar';
import Navbar from './Components/Navbar/Navbar';
import ManagerReview from './Components/ManagerReview/ManagerReview';
import ManagerViewTable from './Components/ManagerReview/ManagerViewTable.jsx';
import Designation from './Components/CreateDesignation/Designation.jsx';
import Designation_Part from './Components/Dashboard/Designation_Part.jsx';
import Department_Part from './Components/Dashboard/Department_Part.jsx';
import Employee_Part from './Components/Dashboard/Employee_Part.jsx';
import EmpManager from './Components/Dashboard/EmpManager.jsx';
import { isTokenExpired } from './utils.js';
import { AuthContext, GetterContext, SetterContext } from './Components/Context/NewContext.jsx';
import { getAllRoles, getDepartments, getDesignation, getEmployees } from './Api/Endpoints/endpoints.js';
import { jwtDecode } from 'jwt-decode';
import Home from './Components/Home/Home.jsx';

function App() {
  const location = useLocation();

  // ❗️ Replace this with real logic later (e.g., check token/localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login page path
  const isLoginPage = location.pathname === "/login";

  // Show Topbar + Navbar only when authenticated
  const showLayout = isAuthenticated && !isLoginPage;

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [me, setMe] = useState(null);
  const [myRole, setMyRole] = useState(null);

  const [token, setToken] = useState('')
  const [userData, setUserData] = useState(null);

  function onLogin(tok, user) {
    setIsAuthenticated(true);
    setToken(tok);
    localStorage.setItem('bizToken', tok);
    setUserData(user);
    location.pathname = '/';
  }

  useEffect(() => {
    getEmployees().then(
      res => {
        // console.log("Context employees ", res);
        setEmployees(res.employees)
      }
    ).catch(
      (exc) => {
        console.error("Failed to fetch employees ", exc);
      }
    );
    getDepartments().then(
      res => {
        // console.log("Context departments are ",res)
        setDepartments(res);
      }
    ).catch(
      exc => {
        console.error("Could not get context departments ", exc)
      }
    )
    getDesignation().then(
      res => {
        // console.log("Context designatiosn ",res)
        setDesignations(res);
      }
    ).catch(
      exc => {
        console.error("Could not ftech context designations ", exc);
      }
    )
    getAllRoles().then(
      res => {
        if (res.result) {
          setRoles(res.result);
        }
        else if (res.error) {
          console.error("Could not get roles ", res.error);
        }
      }
    )

    const storedToken = localStorage.getItem('bizToken');
    if (storedToken) {
      if (!isTokenExpired(storedToken)) {
        const ud = jwtDecode(storedToken);
        setUserData(ud);
        setToken(storedToken);
        setIsAuthenticated(true);
        location.pathname = '/';
      } else {
        localStorage.removeItem('bizToken');
        setUserData(null);
        setToken('');
        setIsAuthenticated(false);
        location.pathname = '/login';
      }
    }
  }, [])

  useEffect(
    () => {
      setMyRole(employees.find(e => e.id == userData.id)?.role);
      setMe(employees.find(e => e.id == userData.id))
    }, [employees, userData]
  )

  return (
    <AuthContext.Provider value={{ token, userData }}>
      <SetterContext.Provider value={{ setDepartments, setEmployees, setDesignations, setRoles }}>
        <GetterContext.Provider value={{ me, myRole, departments, designations, employees, roles }}>
          <div className="div">
            {/* Layout */}
            {showLayout && (
              <>
                <Top_Bar />
                <Navbar />
              </>
            )}

            <Routes>
              {/* Login route (unprotected) */}
              <Route path="/login" element={<Login isAuthenticated={isAuthenticated} onLogin={onLogin} />} />

              {/* Redirect root to dashboard */}
              <Route
                path="/"
                element={
                  isAuthenticated
                    ? <Navigate to="/home" replace />
                    : <Navigate to="/login" replace />
                }
              />

              {/* Protected Routes */}
              {isAuthenticated ? (
                <>
                  {
                    myRole && myRole.power > 50 &&
                    <>
                      <Route path="/add-user" element={<AddUser />} />
                      <Route path="/create-departments" element={<CreateDepartments />} />
                      <Route path="/create-designation" element={<CreateDesignation />} />

                      <Route path="/create-kpi" element={<CreateKPI />} />
                      <Route path="/create-kpi/:dept_id" element={<CreateKPIDept />} />
                      <Route path="/create-kpi/:dept_id/:desg_id" element={<CreateKPIDesg />} />
                    </>
                  }
                  {
                    myRole && myRole.power > 19 &&
                    <>
                      <Route path='/manager' element={<ManagerViewTable />} />
                      <Route path='/manager/:rev_id' element={<ManagerReview />} />
                    </>
                  }

                  {
                    myRole && myRole.power >= 20 &&
                    <>
                      <Route path="/add-kpi-data" element={<AddKPIData />} />
                      <Route path="/add-kpi-data/:dept_id" element={<AddKPIDataDept />} />
                      <Route path="/add-kpi-data/:dept_id/:desg_id" element={<AddKPIDataDesg />} />
                      <Route path="/add-kpi-data/:dept_id/:desg_id/:emp_id" element={<AddKPIDataEmp />} />
                      <Route path="/add-kpi-data/:dept_id/:desg_id/:emp_id/:kpi_id" element={<AddKPIDataKpi />} />
                    </>
                  }

                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/departments/:deptid" element={<Department_Part />} />
                  <Route path="/dashboard/departments/:desname/emp" element={<Designation_Part />} />
                  <Route path="/dashboard/departments/emp/:id" element={<Employee_Part />} />
                  <Route path="/dashboard/departments/emp/:id/manager" element={<EmpManager />} />

                  <Route path='/home' element={<Home />} />
                </>
              ) : (
                // If not authenticated, redirect everything to login
                <Route path="*" element={<Navigate to="/login" replace />} />
              )}
            </Routes>
          </div>
        </GetterContext.Provider>
      </SetterContext.Provider>
    </AuthContext.Provider>

  )
}

export default App;
