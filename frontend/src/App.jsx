import { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from './Components/Login_Page/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import CreateKPI from './Components/CreateKPI/CreateKPI';
import AddKPIData from './Components/AddKPIData/AddKPIData';
import AddUser from './Components/AddUser/AddUser';
import CreateDepartments from './Components/CreateDepartments/CreateDepartments';
import CreateDesignation from './Components/CreateDesignation/CreateDesignation';
import Top_Bar from './Components/Top_Bar/Top_Bar';
import Navbar from './Components/Navbar/Navbar';

function App() {
  const location = useLocation();
  const loginpage = location.pathname === "/login"; 
  const [authenticated, setauthenticated] = useState(true);
  const main = authenticated && !loginpage;

  return (
    <div className="div">
      {main && (
        <>
          <Top_Bar />
          <Navbar />
        </>
      )}

      <Routes>
        <Route path="/login" element={
          authenticated ? <Navigate to="/add-user" replace /> : <Login />
        } />

        <Route path="/" element={
          authenticated ? <Navigate to="/add-user" replace /> : <Navigate to="/login" replace />
        } />

        {authenticated ? (
          <>
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/create-departments" element={<CreateDepartments />} />
            <Route path="/create-designation" element={<CreateDesignation />} />
            <Route path="/create-kpi" element={<CreateKPI />} />
            <Route path="/add-kpi-data" element={<AddKPIData />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
