import React from 'react'
import { Link, Outlet } from 'react-router-dom';

const AdminLeadershipBoard = () => {
   const navItems = [
    { name: "Approved", path: "/admin-approval" },
    { name: "Approval Remaining", path: "/admin-approval/approval-remaining" },
  ];
  return (
  <>
      {/* Navigation Tabs */} 
      <div className="bg-[#DDDDDD] p-3 rounded-lg">
        <ul className="flex gap-3">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`px-3 py-2 rounded-lg text-[16px] font-medium transition-all ${
                  location.pathname === item.path
                    ? "bg-white text-[var(--bluecolor)]"
                    : "text-black hover:bg-white hover:text-[var(--bluecolor)]"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Child routes will render here */}
      <div className="bg-white  rounded-lg mt-4 p-5">
        <Outlet />
      </div>
    </>
  )
}

export default AdminLeadershipBoard
