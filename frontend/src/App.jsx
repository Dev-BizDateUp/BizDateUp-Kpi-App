import './App.css';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from 'react';

import Login from './Components/Login_Page/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateKPI from './Components/CreateKPI/CreateKPI';
import AddKPIData from './Components/AddKPIData/AddKPIData';
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

function App() {
  const location = useLocation();

  // ❗️ Replace this with real logic later (e.g., check token/localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Login page path
  const isLoginPage = location.pathname === "/login";

  // Show Topbar + Navbar only when authenticated
  const showLayout = isAuthenticated && !isLoginPage;

  return (
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
        <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

        {/* Redirect root to dashboard */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate to="/add-user" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/create-departments" element={<CreateDepartments />} />
            <Route path="/create-designation" element={<CreateDesignation />} />
            <Route path="/create-kpi" element={<CreateKPI />} />
            <Route path="/add-kpi-data" element={<AddKPIData />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/departments/:deptid" element={<Department_Part />} />
            <Route path="/dashboard/departments/:desname/emp" element={<Designation_Part />} />
            <Route path="/dashboard/departments/emp/:id" element={<Employee_Part />} />
            <Route path="/dashboard/departments/emp/:id/manager" element={<EmpManager />} />
            <Route path='/manager' element={<ManagerViewTable />} />
            <Route path='/manager/:rev_id' element={<ManagerReview />} />
          </>
        ) : (
          // If not authenticated, redirect everything to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  )
}

export default App;
