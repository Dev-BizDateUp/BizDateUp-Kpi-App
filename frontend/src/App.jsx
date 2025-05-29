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
          </>
        ) : (
          // If not authenticated, redirect everything to login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
